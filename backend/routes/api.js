import express from "express";
import authRoutes from "./authRoute.js";
import adminProductRoutes from "./admin/productRoute.js";
import userProductRoutes from "./user/productRoute.js";
const api = express.Router();

api.use("/", authRoutes);
api.use("/admin/product", adminProductRoutes);
api.use("/user/product", userProductRoutes);

export default api;