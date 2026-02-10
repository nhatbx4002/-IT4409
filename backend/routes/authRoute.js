import express from 'express';
import passport from "passport";
import { signUp, signIn, signOut, getCurrentUser, sendOTPEmail, verifyOTPEmail, resetPassword, signInGoogleController, facebookAuth, facebookAuthCallback, updateUser, refreshAccessToken, verifyEmail, resendVerificationEmail  } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/auth.js';
import { redirectOAuthError } from "../utils/oauth.js";

const router = express.Router();

/**
 * @swagger
 * /auth/signUp:
 *   post:
 *     summary: Đăng ký tài khoản (Auto-login)
 *     description: |
 *       Đăng ký tài khoản mới với auto-login. User sẽ nhận tokens ngay sau khi đăng ký.
 *       
 *       **Password Requirements:**
 *       - Ít nhất 8 ký tự
 *       - Ít nhất 1 chữ hoa (A-Z)
 *       - Ít nhất 1 số (0-9)
 *       - Ít nhất 1 ký tự đặc biệt (!@#$%^&*...)
 *       
 *       **Note:** User sẽ được auto-login nhưng cần verify email để sử dụng đầy đủ tính năng (checkout, review, thêm địa chỉ)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *               - phone
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: "Password123!"
 *                 description: "Min 8 chars, 1 uppercase, 1 number, 1 special char"
 *               name:
 *                 type: string
 *                 example: "Nguyen Van A"
 *               phone:
 *                 type: string
 *                 example: "0901234567"
 *     responses:
 *       200:
 *         description: Đăng ký thành công, trả về tokens để auto-login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản."
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         email:
 *                           type: string
 *                         name:
 *                           type: string
 *                         phone:
 *                           type: string
 *                         role:
 *                           type: string
 *                         email_verified:
 *                           type: boolean
 *                           example: false
 *                     accessToken:
 *                       type: string
 *                       description: JWT access token (1h expiry)
 *                     refreshToken:
 *                       type: string
 *                       description: JWT refresh token (7d expiry)
 *                     emailVerificationRequired:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Lỗi validation hoặc email/phone đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Mật khẩu phải có ít nhất 8 ký tự. Mật khẩu phải có ít nhất 1 chữ hoa."
 */
router.post('/auth/signUp', signUp);

/**
 * @swagger
 * /auth/signIn:
 *   post:
 *     summary: Đăng nhập
 *     description: |
 *       Đăng nhập với email và password. 
 *       
 *       **Note:** User có thể đăng nhập ngay cả khi chưa verify email, 
 *       nhưng sẽ bị giới hạn một số tính năng (checkout, review, thêm địa chỉ).
 *       
 *       Response sẽ chứa `emailVerificationRequired: true` nếu user chưa verify email.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: "Password123!"
 *               isAdminLogin:
 *                 type: boolean
 *                 default: false
 *                 description: Set true nếu đăng nhập vào admin panel
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Đăng nhập thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         email:
 *                           type: string
 *                         name:
 *                           type: string
 *                         role:
 *                           type: string
 *                         email_verified:
 *                           type: boolean
 *                     emailVerificationRequired:
 *                       type: boolean
 *                       description: true nếu user chưa verify email
 *       400:
 *         description: Email hoặc mật khẩu không đúng
 *       403:
 *         description: Admin login nhưng user không có quyền admin
 */
router.post('/auth/signIn', signIn);

/**
 * @swagger
 * /auth/signOut:
 *   get:
 *     summary: Đăng xuất
 *     description: |
 *       Đăng xuất khỏi hệ thống. Tất cả tokens hiện tại sẽ bị invalidate.
 *       
 *       **Note:** User cần đăng nhập lại sau khi logout.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User logged out successfully"
 *       401:
 *         description: Token không hợp lệ hoặc đã hết hạn
 */
router.get('/auth/signOut', authenticateToken, signOut);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Lấy thông tin user hiện tại
 *     description: |
 *       Lấy thông tin của user đang đăng nhập dựa trên access token.
 *       
 *       Response bao gồm `email_verified` để frontend biết user đã xác thực email chưa.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [customer, admin, super_admin]
 *                     provider:
 *                       type: string
 *                       enum: [local, google, facebook]
 *                     email_verified:
 *                       type: boolean
 *                     avatar_url:
 *                       type: string
 *                       nullable: true
 *                     date_of_birth:
 *                       type: string
 *                       format: date
 *                       nullable: true
 *                     gender:
 *                       type: string
 *                       enum: [male, female, other]
 *                       nullable: true
 *                     loyalty_points:
 *                       type: integer
 *                     last_login_at:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Token không hợp lệ hoặc đã hết hạn
 */
router.get('/auth/me', authenticateToken, getCurrentUser);

/**
 * @swagger
 * /auth/send-otp:
 *   post:
 *     summary: Gửi OTP để reset mật khẩu
 *     description: |
 *       Gửi mã OTP 6 số đến email để reset mật khẩu.
 *       
 *       **Flow:**
 *       1. Gọi API này để nhận OTP qua email
 *       2. Gọi `/auth/verify-otp` với OTP nhận được
 *       3. Gọi `/auth/reset-password` với token từ bước 2
 *       
 *       **Note:** OTP có hiệu lực trong 5 phút
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: OTP đã được gửi đến email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "OTP đã được gửi đến email của bạn"
 *       400:
 *         description: Không tìm thấy tài khoản với email này
 */
router.post('/auth/send-otp', sendOTPEmail);

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Xác thực OTP
 *     description: |
 *       Xác thực mã OTP đã gửi qua email.
 *       
 *       Nếu OTP hợp lệ, trả về `token` để sử dụng trong bước reset password.
 *       
 *       **Note:** Token có hiệu lực trong 10 phút
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               otp:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Xác thực OTP thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Xác thực OTP thành công"
 *                 token:
 *                   type: string
 *                   description: Reset token để sử dụng trong /auth/reset-password
 *       400:
 *         description: OTP không đúng hoặc đã hết hạn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "OTP đã hết hạn. Vui lòng yêu cầu gửi lại"
 */
router.post('/auth/verify-otp', verifyOTPEmail);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset mật khẩu
 *     description: |
 *       Đặt lại mật khẩu mới với token từ bước verify-otp.
 *       
 *       **Password Requirements:**
 *       - Ít nhất 8 ký tự
 *       - Ít nhất 1 chữ hoa (A-Z)
 *       - Ít nhất 1 số (0-9)
 *       - Ít nhất 1 ký tự đặc biệt (!@#$%^&*...)
 *       
 *       **Note:** Sau khi reset, tất cả sessions hiện tại sẽ bị invalidate, user cần đăng nhập lại.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token nhận được từ /auth/verify-otp
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *                 example: "NewPassword123!"
 *                 description: "Min 8 chars, 1 uppercase, 1 number, 1 special char"
 *     responses:
 *       200:
 *         description: Reset mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại."
 *       400:
 *         description: Token không hợp lệ hoặc password không đủ mạnh
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Mật khẩu phải có ít nhất 8 ký tự. Mật khẩu phải có ít nhất 1 chữ hoa."
 */
router.post('/auth/reset-password', resetPassword);

/**
 * @swagger
 * /auth/verify-email:
 *   get:
 *     summary: Xác thực email đăng ký
 *     description: |
 *       Xác thực email qua link gửi trong email đăng ký.
 *       
 *       Sau khi xác thực thành công, user có thể sử dụng đầy đủ tính năng:
 *       - Checkout/Đặt hàng
 *       - Viết đánh giá sản phẩm
 *       - Thêm địa chỉ giao hàng
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token xác thực từ email
 *     responses:
 *       302:
 *         description: Redirect về frontend với kết quả xác thực
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *             description: |
 *               - Success: `{FRONTEND_URL}/verify-email?success=true`
 *               - Error: `{FRONTEND_URL}/verify-email?error={message}`
 */
router.get('/auth/verify-email', verifyEmail);

/**
 * @swagger
 * /auth/resend-verification:
 *   post:
 *     summary: Gửi lại email xác thực
 *     description: |
 *       Gửi lại email xác thực cho user chưa verify.
 *       
 *       **Use cases:**
 *       - Email xác thực ban đầu không nhận được
 *       - Link xác thực đã hết hạn (48h)
 *       
 *       **Note:** Chỉ áp dụng cho tài khoản local (không áp dụng cho Google/Facebook login)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Email xác thực đã được gửi lại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Email xác thực đã được gửi lại"
 *       400:
 *         description: Email đã được xác thực hoặc không tìm thấy tài khoản
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Email này đã được xác thực rồi. Bạn có thể đăng nhập ngay."
 */
router.post('/auth/resend-verification', resendVerificationEmail);

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Đăng nhập bằng Google
 *     description: |
 *       Redirect đến Google OAuth để đăng nhập.
 *       
 *       **Flow:**
 *       1. Frontend redirect user đến endpoint này
 *       2. User đăng nhập Google
 *       3. Google redirect về `/auth/google/callback`
 *       4. Backend redirect về frontend với tokens trong URL params
 *       
 *       **Note:** Google accounts tự động được xác thực email (email_verified = true)
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: Optional state parameter để redirect về đúng trang sau khi login
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth
 */
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback sau khi Google xác thực
router.get(
  "/auth/google/callback",
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

/**
 * @swagger
 * /auth/facebook:
 *   get:
 *     summary: Đăng nhập bằng Facebook
 *     description: |
 *       Redirect đến Facebook OAuth để đăng nhập.
 *       
 *       **Flow:**
 *       1. Frontend redirect user đến endpoint này
 *       2. User đăng nhập Facebook
 *       3. Facebook redirect về `/auth/facebook/callback`
 *       4. Backend redirect về frontend với tokens trong URL params
 *       
 *       **Note:** Facebook accounts tự động được xác thực email (email_verified = true)
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: Optional state parameter để redirect về đúng trang sau khi login
 *     responses:
 *       302:
 *         description: Redirect to Facebook OAuth
 */
router.get("/auth/facebook", facebookAuth);

// Callback sau khi Facebook xác thực
router.get(
  "/auth/facebook/callback",
  (req, res, next) => {
    passport.authenticate("facebook", (err, user, info) => {
      const stateParam = typeof req.query?.state === "string" ? req.query.state : undefined;

      if (err) {
        console.error("Facebook OAuth error:", err);
        return redirectOAuthError(
          res,
          "Đăng nhập Facebook thất bại, vui lòng thử lại sau.",
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
          console.error("Facebook OAuth session error:", loginErr);
          return redirectOAuthError(
            res,
            "Không thể hoàn tất đăng nhập, vui lòng thử lại.",
            stateParam
          );
        }
        return facebookAuthCallback(req, res);
      });
    })(req, res, next);
  }
);

/**
 * @swagger
 * /auth/profile/{id}:
 *   put:
 *     summary: Cập nhật thông tin tài khoản
 *     description: |
 *       Cập nhật thông tin profile của user.
 *       
 *       **Note:** User chỉ có thể cập nhật thông tin của chính mình (id trong URL phải match với user đang đăng nhập).
 *       
 *       **Không thể thay đổi:** email, password (dùng reset-password)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID (phải là ID của user đang đăng nhập)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nguyen Van B"
 *               phone:
 *                 type: string
 *                 example: "0909876543"
 *               avatar_url:
 *                 type: string
 *                 example: "https://example.com/avatar.jpg"
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-15"
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cập nhật thông tin thành công"
 *                 user:
 *                   type: object
 *       400:
 *         description: Số điện thoại đã được sử dụng bởi tài khoản khác
 *       401:
 *         description: Token không hợp lệ
 *       403:
 *         description: Không có quyền cập nhật thông tin người khác
 */
router.put("/auth/profile/:id", authenticateToken, updateUser);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: |
 *       Lấy access token mới bằng refresh token.
 *       
 *       **Use case:** Khi access token hết hạn (1h), frontend gọi API này để lấy token mới mà không cần đăng nhập lại.
 *       
 *       **Note:** Refresh token có hiệu lực 7 ngày
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token nhận được khi đăng nhập/đăng ký
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Token refreshed successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         email:
 *                           type: string
 *                         name:
 *                           type: string
 *                         role:
 *                           type: string
 *       401:
 *         description: Refresh token không hợp lệ hoặc đã hết hạn
 */
router.post('/auth/refresh', refreshAccessToken);

export default router;
