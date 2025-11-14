import express from 'express';
import { doctorDashboard, adminDashboard } from '../controllers/analyticsController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/doctor/:doctorId', protect, authorize('doctor', 'admin'), doctorDashboard);
router.get('/admin', protect, authorize('admin'), adminDashboard);

export default router;
