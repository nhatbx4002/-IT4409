/**
 * Middleware to check if user has verified their email
 * Use this for sensitive opereations : like checkout, reviews , etc,...
 *
 */

export const requireEmailVerified = (req, res, next) => {
    //check if user exists (set by authenticateToken)
    if(!req.user){
        return res.status(401).json(
            {
                success: false,
                code: "UNAUTHORIZED",
                message: "Please login to continue!!",
            }
        )
    }

    //oAuth users(Google , Facebook) are auto-verifired
    if(req.user.provider !== "local"){
        return next();
    }

    if(!req.user.email_verified){
        return res.status(401).json({
            success: false,
            code: "EMAIL_NOT_VERIFIED",
            message: "Please verify your email to continue. Check your mail to get a OTP code !",
        })
    }
}