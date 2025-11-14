import express from 'express';
import { listDoctors, createDoctor, updateDoctor, upsertMyDoctorProfile, getMyDoctorProfile, getDoctorById } from '../controllers/doctorController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', listDoctors);
router.post('/', protect, authorize('admin'), createDoctor);
// Self profile routes must come before '/:id' to avoid conflicts
router.get('/me', protect, authorize('doctor','admin'), getMyDoctorProfile);
router.post('/me', protect, authorize('doctor','admin'), upsertMyDoctorProfile);
router.put('/me', protect, authorize('doctor','admin'), upsertMyDoctorProfile);
// Admin or public by id
router.put('/:id', protect, authorize('admin'), updateDoctor);
router.get('/:id', getDoctorById);

export default router;
