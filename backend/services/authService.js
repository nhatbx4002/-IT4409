import { User } from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
//Dang ky user moi bang local
export const registerUser = async (data) => {
    const { email, full_name, password, phone, role, provider } = data;
    //Kiem tra user da ton tai chua
    const checkEmail = await User.findOne({ where: { email}});
    const checkPhone = await User.findOne({ where : { phone }});
    if(checkEmail || checkPhone)throw new Error("User already exists");
    if(!email || !full_name || !password || !phone)throw new Error("Missing required fields");
    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    //Tao user moi
    const newUser = await User.create({
        email,
        full_name,
        phone,
        password: hashedPassword,
        role: role || "customer",
        provider: provider || "local",   
    });
    return newUser;
}

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

  // Tạo access token và refresh token
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "30m" }
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  user.access_token = accessToken;
  user.refresh_token = refreshToken;
  await user.save();

  return {
    user,
    accessToken,
    refreshToken
  };
};

//Dang xua tai khoan local
export const logoutUser = async (email) => {
    const user = await User.findOne({ where: { email } });
    if(!user)throw new Error("User not found");
    user.access_token = null;
    user.refresh_token = null;
    await user.save();
}

//Api quen mat khau

export const transporter = nodemailer.createTransport({
    service: 'gmail',
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
}


let otpStore = {}; //Luu OTP tam thoi

export const sendOtpService = async (email) => {
   const user = await User.findOne({ where: {email}});
   if(!user)throw new Error("User not found");

   //Tao OTP ngau nhien
   const otp = Math.floor(100000 + Math.random() * 900000).toString();

   otpStore[email] = otp;
   setTimeout( () => delete otpStore[email], 5 * 60 * 1000 ); //Xoa OTP sau 5 phut
   //Gui OTP ve email

   await sendEmail(email, "Mã xác thực quên mật khẩu", `Mã OTP của bạn là: ${otp}`);

   return {message: "OTP sent to email"};
}

export const verifyOtpService = async (email, otp) => {
   if(otpStore[email] !== otp)throw new Error("Invalid or expired OTP");

   const token = jwt.sign(
    { email },
    process.env.JWT_RESET_SECRET,
    {expiresIn: "10m"}
   );

   delete otpStore[email]; //Xoa OTP sau khi xac thuc thanh cong

   return { message: "Xac thuc OTP thanh cong", token};
}

export const resetPasswordService = async (token, newPassword) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    const user = await User.findOne({ where: { email: decoded.email } });

    if (!user) throw new Error("Không tìm thấy người dùng");

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return { message: "Đặt lại mật khẩu thành công" };
  } catch (err) {
    throw new Error("Token không hợp lệ hoặc đã hết hạn");
  }
}