import express from 'express';
import passport from "passport";
import { signUp, signIn, signOut,sendOTPEmail, verifyOTPEmail, resetPassword, signInGoogleController, facebookAuth, facebookAuthCallback, updateUser  } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/auth.js';
import { redirectOAuthError } from "../utils/oauth.js";

const router = express.Router();

router.post('/auth/signUp', signUp); //dang ky
router.post('/auth/signIn', signIn); //dang nhap
router.get('/auth/signOut', authenticateToken, signOut); //dang xuat

//quen mat khau
router.post('/auth/send-otp', sendOTPEmail);
router.post('/auth/verify-otp', verifyOTPEmail);
router.post('/auth/reset-password', resetPassword);

//dang nhap bang google
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback sau khi Google xác thực
router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", (err, user, info) => {
      const stateParam = typeof req.query?.state === "string" ? req.query.state : undefined;

      if (err) {
        console.error("Google OAuth error:", err);
        return redirectOAuthError(
          res,
          "Đăng nhập Google thất bại, vui lòng thử lại sau.",
          stateParam
        );
      }

      if (!user) {
        const message =
          info?.message ||
          "Email này đã được đăng ký bằng tài khoản local, vui lòng đăng nhập bằng email & mật khẩu.";
        return redirectOAuthError(res, message, stateParam);
      }

      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error("Google OAuth session error:", loginErr);
          return redirectOAuthError(
            res,
            "Không thể hoàn tất đăng nhập, vui lòng thử lại.",
            stateParam
          );
        }
        return signInGoogleController.googleCallback(req, res);
      });
    })(req, res, next);
  }
);

//dang nhap bang facebook
router.get("/auth/facebook", facebookAuth);

// Callback sau khi Facebook xác thực
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  facebookAuthCallback
);

//Cap nhat thong tin tai khoan
router.put("/auth/profile/:id", authenticateToken, updateUser);

export default router;