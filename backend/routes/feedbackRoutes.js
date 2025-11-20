import express from 'express';
import { 
  createFeedback, 
  listDoctorFeedback, 
  getMyFeedback,
  checkFeedbackExists,
  deleteFeedback
} from '../controllers/feedbackController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes (no auth required)
router.get('/doctor/:doctorId', listDoctorFeedback);

// Protected routes (auth required)
router.post('/', protect, authorize('patient'), createFeedback);
router.get('/me', protect, authorize('patient'), getMyFeedback);
router.get('/check/:doctorId', protect, authorize('patient'), checkFeedbackExists);
router.delete('/:id', protect, authorize('patient'), deleteFeedback);

export default router;
