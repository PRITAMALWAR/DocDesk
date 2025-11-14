import express from 'express';
import { addHistory, getMyHistory, getPatientHistory } from '../controllers/medicalHistoryController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('patient'), addHistory);
router.get('/me', protect, authorize('patient'), getMyHistory);
router.get('/patient/:patientId', protect, authorize('doctor', 'admin'), getPatientHistory);

export default router;
