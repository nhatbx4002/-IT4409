import { registerUser } from "../services/authService.js";

// dang nhap bang tai khoa local
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