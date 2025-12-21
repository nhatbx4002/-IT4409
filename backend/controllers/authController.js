import { registerUser, loginUser, logoutUser, sendOtpService, verifyOtpService, resetPasswordService, signInGoogle, signInFacebook, updateUserService, verifyRefreshToken, createAccessToken } from "../services/authService.js";
import passport  from "passport";
import { buildOAuthCallbackUrl, redirectOAuthError } from "../utils/oauth.js";
import { APP_CONSTANTS } from "../config/constants.js";
import * as cartService from "../services/cartService.js";
import { sendSuccess, sendError } from "./controllerUtils.js";

const extractSessionId = (req) => {
  const headerValue = req.headers["x-session-id"] || req.headers["x-sessionid"];
  if (typeof headerValue === "string" && headerValue.trim()) {
    return headerValue.trim();
  }

  const cookieHeader = req.headers?.cookie;
  if (typeof cookieHeader === "string") {
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map((part) => {
        const [k, v] = part.split("=").map((s) => s.trim());
        return [k, v];
      })
    );
    if (cookies.sessionId) return cookies.sessionId;
  }
  return null;
};

// Get current user from token
export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    
    // req.user is set by authenticateToken middleware
    const { password, access_token, refresh_token, ...userResponse } = req.user;
    
    sendSuccess(res, {
      message: "User retrieved successfully",
      data: userResponse
    });
  } catch (error) {
    sendError(res, error);
  }
};

// dang ky bang tai khoa local
export const signUp = async (req,res) => {
    try{
        const newUser = await registerUser(req.body);
        sendSuccess(res, {
            message: "User registered successfully",
            data: { user: newUser }
        });
    }catch(error){
        sendError(res, error);
    }
}

//Refresh access token
export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token required"
      });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const { User } = await import("../models/index.js");
    const user = await User.findByPk(decoded.id);

    if (!user || user.refresh_token !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token"
      });
    }

    const newAccessToken = createAccessToken(user);

    sendSuccess(res, {
      message: "Token refreshed successfully",
      data: {
        accessToken: newAccessToken,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role
        }
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid refresh token"
    });
  }
};

// dang nhap tai khoan bang local
export const signIn = async (req,res) => {
    try{
       const { email, password, isAdminLogin = false } = req.body;
       const result = await loginUser(email,password);

       // If this is admin login, verify user has admin privileges
       if (isAdminLogin && !['admin', 'super_admin'].includes(result.user.role)) {
         return res.status(403).json({
           success: false,
           message: "Access denied. Admin privileges required."
         });
       }
       const sessionId = extractSessionId(req);
       if (sessionId) {
        try {
          await cartService.mergeGuestCartToUser(result.user.id, sessionId);
        } catch (mergeError) {
          console.error("Merge guest cart failed:", mergeError);
        }
       }
       sendSuccess(res, {
        message: "User logged in successfully",
        data: {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            user: result.user
        }
       });
    }catch(error){
        sendError(res, error);
    }
}

//dang xuat tai khoan
export const signOut = async (req,res) => {
    try{
        const email = req.user.email;
        const result = await logoutUser(email);

        // res.clearCookie("accessToken");
        // res.clearCookie("refreshToken");
        res.status(200).json({
            success: true,
            message: "User logged out successfully",
        })

    }catch(error){
        res.status(400).json({
            success : false,
            message: error.message
        })
    }
}

//Quen mat khau
export const sendOTPEmail = async (req, res) => {
  try {
    const result = await sendOtpService(req.body.email);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const verifyOTPEmail = async (req, res) => {
  try {
    const result = await verifyOtpService(req.body.email, req.body.otp);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const result = await resetPasswordService(token, newPassword);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

//Dang nhap bang google
export const signInGoogleController = {
    //Xử lý callback sau khi Google xác thực thành công
  googleCallback: async (req, res) => {
    try {
      if (!req.user) {
        return redirectOAuthError(
          res,
          "Email này đã được đăng ký bằng tài khoản local, vui lòng đăng nhập bằng email & mật khẩu.",
          typeof req.query?.state === "string" ? req.query.state : undefined
        );
      }

      const user = req.user;

      // Tạo JWT access token và refresh token cho user
      const accessToken = signInGoogle.generateAccessToken(user);
      const refreshToken = signInGoogle.generateRefreshToken(user);

      // Lưu tokens vào database
      await signInGoogle.saveTokensToDatabase(user, accessToken, refreshToken);

      // Redirect về frontend với tokens trong URL params
      const params = {
        accessToken,
        refreshToken,
        userId: user.id.toString(),
        email: user.email,
        fullName: user.full_name,
      };

      if (typeof req.query?.state === "string" && req.query.state.length > 0) {
        params.state = req.query.state;
      }

      return res.redirect(buildOAuthCallbackUrl(params));
    } catch (error) {
      console.error(" Lỗi khi đăng nhập Google:", error);
      return redirectOAuthError(
        res,
        "Đăng nhập Google thất bại, vui lòng thử lại sau.",
        typeof req.query?.state === "string" ? req.query.state : undefined
      );
    }
  },
};

//Dang nhap bang facebook
export const facebookAuth = passport.authenticate("facebook", { scope: ["email"] });

export const signInFacebookController = {
  //Xử lý callback sau khi Facebook xác thực thành công
  facebookCallback: async (req, res) => {
    try {
      if (!req.user) {
        return redirectOAuthError(
          res,
          "Email này đã được đăng ký bằng tài khoản local, vui lòng đăng nhập bằng email & mật khẩu.",
          typeof req.query?.state === "string" ? req.query.state : undefined
        );
      }

      const user = req.user;

      // Tạo JWT access token và refresh token cho user
      const accessToken = signInFacebook.generateAccessToken(user);
      const refreshToken = signInFacebook.generateRefreshToken(user);

      // Lưu tokens vào database
      await signInFacebook.saveTokensToDatabase(user, accessToken, refreshToken);

      // Redirect về frontend với tokens trong URL params
      const params = {
        accessToken,
        refreshToken,
        userId: user.id.toString(),
        email: user.email,
        fullName: user.full_name,
      };

      if (typeof req.query?.state === "string" && req.query.state.length > 0) {
        params.state = req.query.state;
      }

      return res.redirect(buildOAuthCallbackUrl(params));
    } catch (error) {
      console.error(" Lỗi khi đăng nhập Facebook:", error);
      return redirectOAuthError(
        res,
        "Đăng nhập Facebook thất bại, vui lòng thử lại sau.",
        typeof req.query?.state === "string" ? req.query.state : undefined
      );
    }
  },
};

export const facebookAuthCallback = signInFacebookController.facebookCallback;

//Cap nhat thong tin tai khoan
export const updateUser = async (req, res) => {
  try {
    // Lấy id từ params
    const requestedId = parseInt(req.params.id);
    // Lấy id từ token (user đang đăng nhập)
    const authenticatedUserId = req.user.id;

    // Kiểm tra user chỉ có thể cập nhật chính mình
    if (requestedId !== authenticatedUserId) {
      return res.status(403).json({
        success: false,
        message: "Bạn chỉ có thể cập nhật thông tin của chính mình",
      });
    }

    const updateData = req.body;

    // Gọi service để cập nhật
    const updatedUser = await updateUserService(requestedId, updateData);

    // Trả về thông tin user đã cập nhật (không trả về password và tokens)
    const { password, access_token, refresh_token, ...userResponse } = updatedUser.toJSON();

    res.status(200).json({
      success: true,
      message: "Cập nhật thông tin thành công",
      user: userResponse,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
