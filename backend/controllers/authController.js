import { registerUser, loginUser, logoutUser } from "../services/authService.js";

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