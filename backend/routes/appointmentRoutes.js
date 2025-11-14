import express from 'express';
import { createAppointment, listMyAppointments, listAllAppointments, updateAppointmentStatus } from '../controllers/appointmentController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('patient'), createAppointment);
router.get('/me', protect, listMyAppointments);
router.get('/', protect, authorize('admin'), listAllAppointments);
router.patch('/:id/status', protect, authorize('doctor','admin'), updateAppointmentStatus);

export default router;
