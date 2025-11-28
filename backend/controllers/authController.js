import { registerUser, loginUser, logoutUser, sendOtpService, verifyOtpService, resetPasswordService, signInGoogle, signInFacebook, updateUserService } from "../services/authService.js";
import passport  from "passport";
import { buildOAuthCallbackUrl, redirectOAuthError } from "../utils/oauth.js";
import { APP_CONSTANTS } from "../config/constants.js";

// dang ky bang tai khoa local
export const signUp = async (req,res) => {
    try{
        const newUser = await registerUser(req.body);
        res.status(200).json({
            success : true,
            message : "User registered successfully",
            user : newUser
        })
    }catch(error){
        res.status(404).json({
            success : false,
            message: error.message
        })
    }
}
// dang nhap tai khoan bang local
export const signIn = async (req,res) => {
    try{
       const { email, password} = req.body;
       const result = await loginUser(email,password);
       res.status(200).json({
        success: true,
        message: "User logged in successfully",
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: {
            id: result.user.id,
            email: result.user.email,
            full_name: result.user.full_name
        },
       });
    }catch(error){
        res.status(404).json({
            success : false,
            message: error.message
        })
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
        res.status(404).json({
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
      const frontendUrl = APP_CONSTANTS.frontendUrl;
      
      if (!req.user) {
        const errorMessage = encodeURIComponent(
          "Email này đã được đăng ký bằng tài khoản local, vui lòng đăng nhập bằng email & mật khẩu."
        );
        return res.redirect(`${frontendUrl}/auth/callback?error=true&errorMessage=${errorMessage}`);
      }

      const user = req.user;

      // Tạo JWT access token và refresh token cho user
      const accessToken = signInFacebook.generateAccessToken(user);
      const refreshToken = signInFacebook.generateRefreshToken(user);

      // Lưu tokens vào database
      await signInFacebook.saveTokensToDatabase(user, accessToken, refreshToken);

      // Redirect về frontend với tokens trong URL params
      const params = new URLSearchParams({
        accessToken,
        refreshToken,
        userId: user.id.toString(),
        email: user.email,
        fullName: user.full_name,
      });

      return res.redirect(`${frontendUrl}/auth/callback?${params.toString()}`);
    } catch (error) {
      console.error(" Lỗi khi đăng nhập Facebook:", error);
      const frontendUrl = APP_CONSTANTS.frontendUrl;
      const errorMessage = encodeURIComponent("Đăng nhập Facebook thất bại, vui lòng thử lại sau.");
      return res.redirect(`${frontendUrl}/auth/callback?error=true&errorMessage=${errorMessage}`);
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