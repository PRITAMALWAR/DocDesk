import Feedback from '../models/Feedback.js';
import Doctor from '../models/Doctor.js';

export const createFeedback = async (req, res) => {
  const { doctorId, rating, comments } = req.body;
  const fb = await Feedback.create({ patient: req.user._id, doctor: doctorId, rating, comments });
  const agg = await Feedback.aggregate([
    { $match: { doctor: fb.doctor } },
    { $group: { _id: '$doctor', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  const stats = agg[0] || { avg: 0, count: 0 };
  await Doctor.findByIdAndUpdate(doctorId, { rating: stats.avg, ratingCount: stats.count });
  res.status(201).json(fb);
};

export const listDoctorFeedback = async (req, res) => {
  const { doctorId } = req.params;
  const list = await Feedback.find({ doctor: doctorId }).populate('patient', 'name');
  res.json(list);
};
