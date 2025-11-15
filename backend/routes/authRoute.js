import express from 'express';
import passport from "passport";
import { signUp, signIn, signOut,sendOTPEmail, verifyOTPEmail, resetPassword, signInGoogleController, facebookAuth, facebookAuthCallback, updateUser  } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/signUp', signUp); //dang ky
router.post('/signIn', signIn); //dang nhap
router.get('/signOut', authenticateToken, signOut); //dang xuat

//quen mat khau
router.post('/send-otp', sendOTPEmail);
router.post('/verify-otp', verifyOTPEmail);
router.post('/reset-password', resetPassword);

//dang nhap bang google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback sau khi Google xác thực
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  signInGoogleController.googleCallback
);

//dang nhap bang facebook
router.get("/facebook", facebookAuth);

// Callback sau khi Facebook xác thực
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  facebookAuthCallback
);

//Cap nhat thong tin tai khoan
router.put("/profile/:id", authenticateToken, updateUser);

export default router;