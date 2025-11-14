import Appointment from '../models/Appointment.js';
import { normalizeDate, isValidTime, weekdayShort } from '../utils/dateUtils.js';
import { sendEmail } from '../services/emailService.js';
import Doctor from '../models/Doctor.js';

export const createAppointment = async (req, res) => {
  const { doctorId, date, time } = req.body;
  if (!isValidTime(time)) return res.status(400).json({ message: 'Invalid time' });
  const normalized = normalizeDate(date);
  try {
    const doc = await Doctor.findById(doctorId).populate('user', 'email name');
    if (!doc) return res.status(404).json({ message: 'Doctor not found' });
    const day = weekdayShort(normalized); // e.g., 'Mon'
    const dayAvail = (doc.availability || []).find((d) => {
      if (!d?.day) return false;
      const val = String(d.day).slice(0,3).toLowerCase();
      return val === day.toLowerCase();
    });
    if (!dayAvail || !(dayAvail.slots || []).includes(time)) {
      return res.status(400).json({ message: 'Selected slot not in doctor availability' });
    }

    const appt = await Appointment.create({ patient: req.user._id, doctor: doctorId, date: normalized, time, status: 'pending' });
    await sendEmail({ to: req.user.email, subject: 'Appointment Request Submitted', text: `Requested with Dr. ${doc.user?.name || 'Doctor'} on ${normalized} at ${time}` });
    if (doc.user?.email) {
      await sendEmail({ to: doc.user.email, subject: 'New Appointment Request', text: `Request for ${normalized} at ${time}` });
    }
    res.status(201).json(appt);
  } catch (e) {
    if (e.code === 11000) return res.status(400).json({ message: 'Slot not available' });
    throw e;
  }
};

export const listMyAppointments = async (req, res) => {
  let filter;
  if (req.user.role === 'doctor') {
    const doc = await Doctor.findOne({ user: req.user._id });
    if (!doc) return res.status(404).json({ message: 'Linked doctor profile not found' });
    filter = { doctor: doc._id };
  } else {
    filter = { patient: req.user._id };
  }
  const appts = await Appointment.find(filter).populate('doctor').populate('patient', 'name email');
  res.json(appts);
};

export const listAllAppointments = async (req, res) => {
  const appts = await Appointment.find().populate('doctor').populate('patient', 'name email');
  res.json(appts);
};

export const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const valid = ['pending', 'confirmed', 'cancelled', 'completed'];
  if (!valid.includes(status)) return res.status(400).json({ message: 'Invalid status' });
  const appt = await Appointment.findByIdAndUpdate(id, { status }, { new: true });
  if (!appt) return res.status(404).json({ message: 'Appointment not found' });
  res.json(appt);
};
