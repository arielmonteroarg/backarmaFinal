import { Router } from 'express';
import { forgotPassword, resetPassword } from '../controllers/auth.controller.js';

const router = Router();

router.post('/forgot-password', forgotPassword);
router.post('/recover/:token', resetPassword);

export default router;