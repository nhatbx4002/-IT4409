import { Router } from "express";
import { authenticateToken } from "../../middlewares/auth.js";
import { getProfile } from "../../controllers/user/profileController.js";
import wishlistRoutes from "./wishlistRoutes.js";

const userRouter = Router();

userRouter.use("/wishlist", wishlistRoutes);
userRouter.get("/user/profile", authenticateToken, getProfile);

export default userRouter;
