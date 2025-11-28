import { Router } from "express";
import productRoutes from "./productRoute.js";
import wishlistRoutes from "./wishlistRoutes.js";

const userRouter = Router();

userRouter.use("/user/products", productRoutes);
userRouter.use("/wishlist", wishlistRoutes);

export default userRouter;

