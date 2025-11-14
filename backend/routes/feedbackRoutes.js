import express from 'express';
import { createFeedback, listDoctorFeedback } from '../controllers/feedbackController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('patient'), createFeedback);
router.get('/doctor/:doctorId', listDoctorFeedback);

export default router;
