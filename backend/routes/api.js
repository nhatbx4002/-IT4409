import express from "express";
import authRoutes from "./authRoute.js";
import adminProductRoutes from "./admin/productRoute.js";
import userProductRoutes from "./user/productRoute.js";
import adminGetRevenueStats from "./admin/statsRoute.js";

import wishlistRoutes from "./user/wishlistRoutes.js";
import userRoutes from "./admin/userRoutes.js";
import promotionRoutes from "./promotionRoutes.js";
const api = express.Router();

// 1. Auth (Đăng nhập/Đăng ký)
api.use("/", authRoutes);
api.use("/admin/product", adminProductRoutes);
api.use("/user/product", userProductRoutes);
api.use("/admin/stats", adminGetRevenueStats);

// 3. Wishlist (Người dùng)
api.use("/wishlist", wishlistRoutes);
// 4. Quản lý người dùng (Admin)
api.use("/admin/users", userRoutes);

// 5. Khuyến mãi (Promotion)
api.use("/promotions", promotionRoutes);

export default api;
