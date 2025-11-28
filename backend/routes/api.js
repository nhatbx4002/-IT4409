import express from "express";
import authRoutes from "./authRoute.js";
import adminRouter from "./admin/index.js";
import userRouter from "./user/index.js";
import promotionRoutes from "./promotionRoutes.js";
import cartRoutes from "./cartRoute.js";
import orderRoutes from "./orderRoute.js";
import addressRoutes from "./addressRoute.js";

const api = express.Router();

api.use("/", authRoutes);
api.use("/", adminRouter);
api.use("/", userRouter);
api.use("/promotions", promotionRoutes);
api.use("/cart", cartRoutes);
api.use("/orders", orderRoutes);
api.use("/addresses", addressRoutes);

export default api;