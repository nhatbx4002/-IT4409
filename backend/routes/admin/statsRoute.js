import express from "express";
import { getRevenueStatsController, getTopProductsController } from "../../controllers/admin/statsController.js";

const router = express.Router();

/**
 * @swagger
 * /admin/stats/revenue:
 *   get:
 *     summary: Lấy thống kê doanh thu (Admin)
 *     tags: [Admin, Stats]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Thống kê doanh thu
 */
router.get("/revenue", getRevenueStatsController);

/**
 * @swagger
 * /admin/stats/top-products:
 *   get:
 *     summary: Lấy top sản phẩm bán chạy (Admin)
 *     tags: [Admin, Stats]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Danh sách top sản phẩm
 */
router.get("/top-products", getTopProductsController);

export default router;