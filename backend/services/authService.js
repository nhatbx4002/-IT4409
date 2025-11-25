import { User } from "../models/index.js";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

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
  signToken(buildTokenPayload(user), process.env.JWT_SECRET, ACCESS_TOKEN_TTL);

export const createRefreshToken = (user) =>
  signToken(
    buildTokenPayload(user),
    process.env.JWT_REFRESH_SECRET,
    REFRESH_TOKEN_TTL
  );

export const verifyAccessToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET);

export const verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET);

export const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
};

const ensureTokenVersion = async (user) => {
  if (typeof user.token_version !== "number") {
    user.token_version = 0;
    await user.save();
  }
  return user.token_version;
};

const persistLoginState = async (user, refreshToken) => {
  await ensureTokenVersion(user);
  user.refresh_token = refreshToken;
  user.access_token = null;
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
  await persistLoginState(user, refreshToken);
  return { accessToken, refreshToken };
};

//Dang ky user moi bang local
export const registerUser = async (data) => {
  const { email, full_name, password, phone, role, provider } = data;
  const checkEmail = await User.findOne({ where: { email } });
  const checkPhone = await User.findOne({ where: { phone } });
  if (checkEmail || checkPhone) throw new Error("User already exists");
  if (!email || !full_name || !password || !phone)
    throw new Error("Missing required fields");

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    email,
    full_name,
    phone,
    password: hashedPassword,
    role: role || "customer",
    provider: provider || "local",
    token_version: 0,
  });
  return newUser;
};

//Dang nhap user bang local
export const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error("Invalid email or password");
  }

  const tokens = await issueTokens(user);

  return {
    user,
    ...tokens,
  };
};

//Dang xua tai khoan local
export const logoutUser = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");
  await invalidateUserTokens(user);
};

//Api quen mat khau

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: `"Docify Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

let otpStore = {}; //Luu OTP tam thoi

export const sendOtpService = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore[email] = otp;
  setTimeout(() => delete otpStore[email], 5 * 60 * 1000);

  await sendEmail(email, "Mã xác thực quên mật khẩu", `Mã OTP của bạn là: ${otp}`);

  return { message: "OTP sent to email" };
};

export const verifyOtpService = async (email, otp) => {
  if (otpStore[email] !== otp) throw new Error("Invalid or expired OTP");

  const token = jwt.sign({ email }, process.env.JWT_RESET_SECRET, {
    expiresIn: "10m",
  });

  delete otpStore[email];

  return { message: "Xac thuc OTP thanh cong", token };
};

export const resetPasswordService = async (token, newPassword) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    const user = await User.findOne({ where: { email: decoded.email } });

    if (!user) throw new Error("Không tìm thấy người dùng");

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await invalidateUserTokens(user);

    return { message: "Đặt lại mật khẩu thành công" };
  } catch (err) {
    throw new Error("Token không hợp lệ hoặc đã hết hạn");
  }
};

const socialAuthFactory = (providerLabel) => ({
  generateAccessToken: (user) => createAccessToken(user),
  generateRefreshToken: (user) => createRefreshToken(user),
  saveTokensToDatabase: async (user, _accessToken, refreshToken) => {
    await persistLoginState(user, refreshToken);
  },
  formatUserResponse: (user, accessToken, refreshToken) => ({
    success: true,
    message: `Đăng nhập ${providerLabel} thành công`,
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
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

  return user;
};
