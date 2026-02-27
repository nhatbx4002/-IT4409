import { User } from "../models/index.js";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { loadEnv } from "../config/env.js";
import { DOCIFY_SUPPORT_SENDER } from "../config/constants.js";
import { sendVerificationEmail } from "./emailService.js";
import { validatePassword } from "../utils/passwordValidator.js";
import {Cart} from "../models/index.js"

const env = loadEnv();
const isProduction = env.NODE_ENV === "production";

const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = "7d";

const buildTokenPayload = (user) => ({
  id: user.id,
  email: user.email,
  provider: user.provider,
  version: user.token_version || 0,
});

const signToken = (payload, secret, expiresIn) =>
  jwt.sign(payload, secret, { expiresIn });

export const createAccessToken = (user) =>
  signToken(buildTokenPayload(user), env.JWT_SECRET, ACCESS_TOKEN_TTL);

export const createRefreshToken = (user) =>
  signToken(
    buildTokenPayload(user),
    env.JWT_REFRESH_SECRET,
    REFRESH_TOKEN_TTL
  );

export const verifyAccessToken = (token) =>
  jwt.verify(token, env.JWT_SECRET);

export const verifyRefreshToken = (token) =>
  jwt.verify(token, env.JWT_REFRESH_SECRET);

export const sessionConfig = {
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  },
};

const ensureTokenVersion = async (user) => {
  if (typeof user.token_version !== "number") {
    user.token_version = 0;
    await user.save();
  }
  return user.token_version;
};

const persistLoginState = async (user, accessToken, refreshToken) => {
  await ensureTokenVersion(user);
  user.access_token = accessToken;
  user.refresh_token = refreshToken;
  await user.save();
};

export const invalidateUserTokens = async (user) => {
  user.token_version = (user.token_version || 0) + 1;
  user.refresh_token = null;
  user.access_token = null;
  await user.save();
};

export const issueTokens = async (user) => {
  await ensureTokenVersion(user);
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  await persistLoginState(user, accessToken, refreshToken);
  return { accessToken, refreshToken };
};

//Dang ky user moi bang local
export const registerUser = async (user) => {
  const {email , name , password , phone , role , provider} = user;

  //== VALIDATION ===
  if(!email || !name || !password || !phone ){
    throw new Error("Missing required fields");
  }

  //validate password strength
  const passwordValidation = validatePassword(password);
  if(!passwordValidation.isValid){
    throw new Error(passwordValidation.errors.join("."));
  }

  const checkEmail = await User.findOne({ where: { email } });
  if(checkEmail){
    throw new Error("Email already exists");
  }

  const checkPhone = await User.findOne({ where: { phone } });
  if (checkPhone) {
    throw new Error("Số điện thoại đã được sử dụng");
  }

  // === CREATE USER ===
  const hashedPassword = await bcrypt.hash(password, 10);

  // Tạo verification token (JWT với expiry 48h)
  const verificationToken = jwt.sign(
      { email, type: "email_verification" },
      env.JWT_SECRET,
      { expiresIn: "48h" }
  );

  // Tạo user với email_verified = false
  const newUser = await User.create({
    email,
    name,
    phone,
    password: hashedPassword,
    role: role || "customer",
    provider: provider || "local",
    token_version: 0,
    email_verified: false,
    email_verification_token: verificationToken,
  });

  // === TẠO CART CHO USER MỚI ===
  try {
    await Cart.create({ user_id: newUser.id });
  } catch (cartError) {
    console.error("Lỗi tạo cart:", cartError);
    // Không throw error, cart có thể tạo sau
  }

  // === GỬI EMAIL XÁC THỰC ===
  try {
    await sendVerificationEmail(email, verificationToken, name);
  } catch (emailError) {
    console.error("Lỗi gửi email xác thực:", emailError);
    // KHÔNG xóa user nữa, vẫn cho đăng ký thành công
    // User có thể yêu cầu gửi lại email sau
  }

  const { accessToken, refreshToken } = await issueTokens(newUser);

  const userWithoutSecrets = await User.scope("withoutSecrets").findByPk(newUser.id);
  return {
    user: userWithoutSecrets,
    accessToken,
    refreshToken,
    emailVerificationRequired: true,
    message: "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản."
  };
}
//Dang nhap user bang local
export const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // Find user
  const userWithPassword = await User.findOne({ where: { email } });
  if (!userWithPassword) {
    throw new Error("Email hoặc mật khẩu không đúng");
  }

  // Verify password
  const hashedPassword = userWithPassword.password;
  if (!hashedPassword) {
    throw new Error("Email hoặc mật khẩu không đúng");
  }

  const isValidPassword = await bcrypt.compare(password, hashedPassword);
  if (!isValidPassword) {
    throw new Error("Email hoặc mật khẩu không đúng");
  }

  // Update last_login_at
  userWithPassword.last_login_at = new Date();
  await userWithPassword.save();

  // Issue tokens
  const tokens = await issueTokens(userWithPassword);

  // Get user without secrets
  const user = await User.scope("withoutSecrets").findOne({ where: { email } });

  return {
    user: {
      ...user.toJSON(),
      email_verified: userWithPassword.email_verified
    },
    ...tokens,
  };
};

//Dang xuat tai khoan local
export const logoutUser = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");
  await invalidateUserTokens(user);
};

//Api quen mat khau
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: DOCIFY_SUPPORT_SENDER,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};


export const sendOtpService = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("Không tìm thấy tài khoản với email này");
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Set expiration time (5 minutes)
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

  user.reset_otp = otp;
  user.reset_otp_expires = otpExpires;
  await user.save();

  // Send email
  await sendEmail(
      email,
      "Mã xác thực quên mật khẩu - Docify",
      `Mã OTP của bạn là: ${otp}\n\nMã này sẽ hết hạn sau 5 phút.\n\nNếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.`
  );

  return { message: "OTP đã được gửi đến email của bạn" };
};
export const verifyOtpService = async (email, otp) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error("Không tìm thấy tài khoản");
  }

  // Check if OTP exists
  if (!user.reset_otp || !user.reset_otp_expires) {
    throw new Error("Chưa có yêu cầu đặt lại mật khẩu hoặc OTP đã hết hạn");
  }

  // Check if OTP expired
  if (new Date() > new Date(user.reset_otp_expires)) {
    // Clear expired OTP
    user.reset_otp = null;
    user.reset_otp_expires = null;
    await user.save();
    throw new Error("OTP đã hết hạn. Vui lòng yêu cầu gửi lại");
  }

  // Verify OTP
  if (user.reset_otp !== otp) {
    throw new Error("Mã OTP không đúng");
  }

  // === CLEAR OTP sau khi verify thành công ===
  user.reset_otp = null;
  user.reset_otp_expires = null;
  await user.save();

  // Generate reset token
  const token = jwt.sign({ email }, env.JWT_RESET_SECRET, {
    expiresIn: "10m",
  });

  return { message: "Xác thực OTP thành công", token };
};

export const resetPasswordService = async (token, newPassword) => {
  // === VALIDATE PASSWORD STRENGTH ===
  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.isValid) {
    throw new Error(passwordValidation.errors.join(". "));
  }

  try {
    // Verify reset token
    const decoded = jwt.verify(token, env.JWT_RESET_SECRET);
    const user = await User.findOne({ where: { email: decoded.email } });

    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }

    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    // Invalidate all existing tokens (force re-login)
    await invalidateUserTokens(user);

    return { message: "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại." };
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new Error("Link đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu gửi lại OTP.");
    }
    if (err.name === "JsonWebTokenError") {
      throw new Error("Link đặt lại mật khẩu không hợp lệ");
    }
    throw err;
  }
};

// Xác thực email
export const verifyEmailService = async (token) => {
  try {
    // Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET);
    
    if (decoded.type !== 'email_verification') {
      throw new Error("Invalid token type");
    }

    // Tìm user theo email và token
    const user = await User.findOne({ 
      where: { 
        email: decoded.email,
        email_verification_token: token 
      } 
    });

    if (!user) {
      throw new Error("Invalid or expired verification token");
    }

    // Nếu đã xác thực rồi
    if (user.email_verified) {
      return { message: "Email đã được xác thực trước đó" };
    }

    // Xác thực email
    user.email_verified = true;
    user.email_verification_token = null; // Xóa token sau khi dùng
    await user.save();

    return { 
      message: "Email đã được xác thực thành công. Bạn có thể đăng nhập ngay bây giờ."
    };
  } catch (err) {
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      throw new Error("Link xác thực không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu gửi lại email.");
    }
    throw err;
  }
};

// Gửi lại email xác thực
export const resendVerificationEmailService = async (email) => {
  const user = await User.findOne({ where: { email } });
  
  if (!user) {
    throw new Error("Không tìm thấy tài khoản với email này");
  }

  // Chỉ cho phép gửi lại nếu chưa xác thực
  if (user.email_verified) {
    throw new Error("Email này đã được xác thực rồi. Bạn có thể đăng nhập ngay.");
  }

  // Chỉ cho local accounts
  if (user.provider !== "local") {
    throw new Error("Tài khoản này không cần xác thực email");
  }

  // Tạo token mới
  const verificationToken = jwt.sign(
    { email: user.email, type: 'email_verification' },
    env.JWT_SECRET,
    { expiresIn: '48h' }
  );

  // Lưu token mới
  user.email_verification_token = verificationToken;
  await user.save();

  // Gửi email
  try {
    await sendVerificationEmail(email, verificationToken, user.name || "Bạn");
    return { message: "Email xác thực đã được gửi lại" };
  } catch (emailError) {
    console.error("Lỗi gửi email xác thực:", emailError);
    throw new Error("Không thể gửi email. Vui lòng thử lại sau.");
  }
};

const socialAuthFactory = (providerLabel) => ({
  generateAccessToken: (user) => createAccessToken(user),
  generateRefreshToken: (user) => createRefreshToken(user),
  saveTokensToDatabase: async (user, accessToken, refreshToken) => {
    await persistLoginState(user, accessToken, refreshToken);
  },
  formatUserResponse: (user, accessToken, refreshToken) => ({
    success: true,
    message: `Đăng nhập ${providerLabel} thành công`,
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      provider: user.provider,
    },
  }),
});

export const signInGoogle = socialAuthFactory("Google");
export const signInFacebook = socialAuthFactory("Facebook");

//Cap nhat thong tin tai khoan
export const updateUserService = async (userId, newData) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User does not exist!");
  }

  const { email, password, ...allowedFields } = newData;

  if (allowedFields.phone && allowedFields.phone !== user.phone) {
    const existingPhone = await User.findOne({
      where: {
        phone: allowedFields.phone,
        id: { [Op.ne]: userId },
      },
    });
    if (existingPhone) {
      throw new Error("Số điện thoại này đã được sử dụng bởi tài khoản khác");
    }
  }

  await user.update(allowedFields);
  await user.reload();

  // Return user without sensitive fields
  return await User.scope('withoutSecrets').findByPk(userId);
};
