import { Router } from "express";
import productRoutes from "./productRoute.js";
import statsRoutes from "./statsRoute.js";
import adminUserRoutes from "./userRoutes.js";

const adminRouter = Router();

adminRouter.use("/admin/products", productRoutes);
adminRouter.use("/admin/stats", statsRoutes);
adminRouter.use("/admin/users", adminUserRoutes);

export default adminRouter;

