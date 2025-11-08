import express from "express";
import authRoutes from "./authRoute.js";
import cartRoutes from "./cartRoute.js";

const api = express.Router();

api.use("/", authRoutes);
api.use("/cart", cartRoutes);

export default api;