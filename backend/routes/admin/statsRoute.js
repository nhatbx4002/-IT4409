import express from "express";
import { getRevenueStatsController, getTopProductsController } from "../../controllers/admin/statsController.js";

const router = express.Router();
router.get("/revenue", getRevenueStatsController);
router.get("/top-products", getTopProductsController);

export default router;