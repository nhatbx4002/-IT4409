import express from "express";
import authRoutes from "./authRoute.js";
import adminProductRoutes from "./admin/productRoute.js";
import userProductRoutes from "./user/productRoute.js";
import adminGetRevenueStats from "./admin/statsRoute.js";
const api = express.Router();

api.use("/", authRoutes);
api.use("/admin/product", adminProductRoutes);
api.use("/user/product", userProductRoutes);
api.use("/admin/stats", adminGetRevenueStats);
export default api;