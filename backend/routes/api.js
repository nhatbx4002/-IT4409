import express from "express";
import authRoutes from "./authRoute.js";
import cartRoutes from "./cartRoute.js";
import orderRoutes from "./orderRoute.js";
import addressRoutes from "./addressRoute.js";
const api = express.Router();

api.use("/", authRoutes);
api.use("/cart", cartRoutes);
api.use("/orders", orderRoutes);
api.use("/addresses", addressRoutes);
export default api;