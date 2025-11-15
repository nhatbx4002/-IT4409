import express from "express";
import authRoutes from "./authRoute.js";
import adminProductRoutes from "./admin/productRoute.js"
const api = express.Router();

api.use("/", authRoutes);
api.use("/admin/product", adminProductRoutes);

export default api;