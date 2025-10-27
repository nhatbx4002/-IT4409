import { User } from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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

