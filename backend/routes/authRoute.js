import express from 'express';
import { signUp, signIn, signOut,sendOTPEmail, verifyOTPEmail, resetPassword  } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/signUp', signUp); //dang ky
router.post('/signIn', signIn); //dang nhap
router.get('/signOut', authenticateToken, signOut); //dang xuat

//quen mat khau
router.post('/send-otp', sendOTPEmail);
router.post('/verify-otp', verifyOTPEmail);
router.post('/reset-password', resetPassword);

export default router;