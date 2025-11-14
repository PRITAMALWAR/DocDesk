import express from 'express';
import { addHistory, getMyHistory, getPatientHistory, updateMyHistory, deleteMyHistory } from '../controllers/medicalHistoryController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('patient'), addHistory);
router.get('/me', protect, authorize('patient'), getMyHistory);
router.get('/patient/:patientId', protect, authorize('doctor', 'admin'), getPatientHistory);
router.patch('/:id', protect, authorize('patient'), updateMyHistory);
router.delete('/:id', protect, authorize('patient'), deleteMyHistory);

export default router;
