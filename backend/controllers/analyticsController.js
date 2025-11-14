import { getAdminStats, getDoctorStats } from '../services/analyticsService.js';

export const doctorDashboard = async (req, res) => {
  const { doctorId } = req.params;
  const stats = await getDoctorStats(doctorId);
  res.json(stats);
};

export const adminDashboard = async (req, res) => {
  const stats = await getAdminStats();
  res.json(stats);
};
