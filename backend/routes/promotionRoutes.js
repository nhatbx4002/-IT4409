import express from "express";
import * as promotionController from "../controllers/promotionController.js";
import { authenticateToken } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /promotions:
 *   get:
 *     summary: Lấy danh sách khuyến mãi
 *     tags: [Promotions]
 *     responses:
 *       200:
 *         description: Danh sách khuyến mãi
 */
router.get("/", promotionController.getPromotions);

/**
 * @swagger
 * /promotions/apply:
 *   post:
 *     summary: Áp dụng mã giảm giá
 *     tags: [Promotions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Áp dụng mã giảm giá thành công
 *       400:
 *         description: Mã giảm giá không hợp lệ
 */
router.post("/apply", promotionController.applyCoupon);

/**
 * @swagger
 * /promotions/create:
 *   post:
 *     summary: Tạo khuyến mãi mới (Admin only)
 *     tags: [Promotions, Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - discount
 *               - startDate
 *               - endDate
 *             properties:
 *               code:
 *                 type: string
 *               discount:
 *                 type: number
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               maxUses:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Tạo khuyến mãi thành công
 *       400:
 *         description: Lỗi tạo khuyến mãi
 *       403:
 *         description: Không có quyền truy cập
 */
router.post("/create", authenticateToken, isAdmin, promotionController.createPromotion);

/**
 * @swagger
 * /promotions/{id}:
 *   delete:
 *     summary: Xóa khuyến mãi (Admin only)
 *     tags: [Promotions, Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa khuyến mãi thành công
 *       404:
 *         description: Không tìm thấy khuyến mãi
 *       403:
 *         description: Không có quyền truy cập
 */
router.delete("/:id", authenticateToken, isAdmin, promotionController.deletePromotion);

export default router;