import express from 'express';
import { sendNotification } from '../controllers/notificationController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('admin'), sendNotification);

export default router;
