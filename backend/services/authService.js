import { User } from "../models/index.js";
import bcrypt from "bcryptjs";
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