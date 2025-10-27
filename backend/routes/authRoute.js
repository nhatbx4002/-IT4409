import express from 'express';
import { signUp, signIn, signOut  } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/signUp', signUp); //dang ky
router.post('/signIn', signIn); //dang nhap
router.get('/signOut', authenticateToken, signOut); //dang xuat

export default router;