import express from 'express';
import { login, register, me } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { body } from 'express-validator';
import { validate } from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('name required'),
    body('email').isEmail().withMessage('valid email required'),
    body('password').isLength({ min: 6 }).withMessage('min 6 chars password'),
    body('role').optional().isIn(['patient', 'doctor', 'admin']).withMessage('invalid role')
  ],
  validate,
  register
);
router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  validate,
  login
);
router.get('/me', protect, me);

export default router;
