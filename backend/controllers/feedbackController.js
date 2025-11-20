import Feedback from '../models/Feedback.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import mongoose from 'mongoose';

export const createFeedback = async (req, res) => {
  try {
    const { doctorId, rating, comments, appointmentId } = req.body;
    
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Validate doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if patient has a confirmed or completed appointment with this doctor
    const hasAppointment = await Appointment.findOne({
      patient: req.user._id,
      doctor: doctorId,
      status: { $in: ['confirmed', 'completed'] }
    });
    
    if (!hasAppointment) {
      return res.status(403).json({ 
        message: 'You can only provide feedback for doctors whose appointments have been confirmed' 
      });
    }

    // Check if feedback already exists for this patient-doctor pair
    const existingFeedback = await Feedback.findOne({
      patient: req.user._id,
      doctor: doctorId
    });

    if (existingFeedback) {
      // Update existing feedback
      existingFeedback.rating = rating;
      existingFeedback.comments = comments || existingFeedback.comments;
      if (appointmentId) {
        existingFeedback.appointment = appointmentId;
      }
      await existingFeedback.save();
      
      // Update doctor rating stats
      const agg = await Feedback.aggregate([
        { $match: { doctor: doctorId } },
        { $group: { _id: '$doctor', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
      ]);
      const stats = agg[0] || { avg: 0, count: 0 };
      await Doctor.findByIdAndUpdate(doctorId, { 
        rating: Math.round(stats.avg * 10) / 10, 
        ratingCount: stats.count 
      });
      
      return res.json(existingFeedback);
    }

    // Create new feedback
    const feedbackData = {
      patient: req.user._id,
      doctor: doctorId,
      rating,
      comments: comments || ''
    };
    
    if (appointmentId) {
      feedbackData.appointment = appointmentId;
    }
    
    const fb = await Feedback.create(feedbackData);
    
    // Update doctor rating stats
    const agg = await Feedback.aggregate([
      { $match: { doctor: doctorId } },
      { $group: { _id: '$doctor', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    const stats = agg[0] || { avg: 0, count: 0 };
    await Doctor.findByIdAndUpdate(doctorId, { 
      rating: Math.round(stats.avg * 10) / 10, 
      ratingCount: stats.count 
    });
    
    res.status(201).json(fb);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to create feedback' });
  }
};

export const listDoctorFeedback = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const list = await Feedback.find({ doctor: doctorId })
      .populate('patient', 'name email')
      .sort({ createdAt: -1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch feedback' });
  }
};

export const getMyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ patient: req.user._id })
      .populate('doctor', 'specialty')
      .populate('doctor.user', 'name')
      .sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch feedback' });
  }
};

export const checkFeedbackExists = async (req, res) => {
  try {
    const { doctorId } = req.params;
    
    if (!doctorId) {
      return res.status(400).json({ message: 'Doctor ID is required' });
    }

    // Validate doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const feedback = await Feedback.findOne({
      patient: req.user._id,
      doctor: doctorId
    });
    
    // Check if patient has a confirmed or completed appointment with this doctor
    const hasAppointment = await Appointment.findOne({
      patient: req.user._id,
      doctor: doctorId,
      status: { $in: ['confirmed', 'completed'] }
    });
    
    res.json({ 
      exists: !!feedback, 
      feedback: feedback || null,
      canSubmit: !!hasAppointment
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to check feedback' });
  }
};

// Helper function to check if appointment allows feedback
export const canSubmitFeedback = async (patientId, doctorId) => {
  const appointment = await Appointment.findOne({
    patient: patientId,
    doctor: doctorId,
    status: { $in: ['confirmed', 'completed'] }
  });
  return !!appointment;
};

export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findById(id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    // Check if user owns this feedback
    if (feedback.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this feedback' });
    }
    
    const doctorId = feedback.doctor;
    await Feedback.findByIdAndDelete(id);
    
    // Update doctor rating stats
    const agg = await Feedback.aggregate([
      { $match: { doctor: doctorId } },
      { $group: { _id: '$doctor', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    const stats = agg[0] || { avg: 0, count: 0 };
    await Doctor.findByIdAndUpdate(doctorId, { 
      rating: Math.round(stats.avg * 10) / 10, 
      ratingCount: stats.count 
    });
    
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to delete feedback' });
  }
};
