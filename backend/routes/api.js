import express from "express";
import authRoutes from "./authRoute.js";

const api = express.Router();

api.use("/", authRoutes);


export default api;