import Appointment from '../models/Appointment.js';
import Feedback from '../models/Feedback.js';

export const getDoctorStats = async (doctorId) => {
  const total = await Appointment.countDocuments({ doctor: doctorId });
  const cancelled = await Appointment.countDocuments({ doctor: doctorId, status: 'cancelled' });
  const completed = await Appointment.countDocuments({ doctor: doctorId, status: 'completed' });
  const ratings = await Feedback.find({ doctor: doctorId }).select('rating');
  const avgRating = ratings.length ? ratings.reduce((a, b) => a + b.rating, 0) / ratings.length : 0;
  return { total, cancelled, completed, avgRating };
};

export const getAdminStats = async () => {
  const total = await Appointment.countDocuments();
  const cancelled = await Appointment.countDocuments({ status: 'cancelled' });
  const completed = await Appointment.countDocuments({ status: 'completed' });
  return { total, cancelled, completed };
};
