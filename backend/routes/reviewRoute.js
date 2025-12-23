import express from "express";
import { authenticateToken } from "../middlewares/auth.js";
import {
  listProductReviewsController,
  createReviewController,
} from "../controllers/user/reviewController.js";

const router = express.Router();

/**
 * @swagger
 * /reviews/product/{productId}:
 *   get:
 *     summary: Lấy danh sách đánh giá theo sản phẩm
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 6
 *     responses:
 *       200:
 *         description: Danh sách đánh giá
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.get("/product/:productId", listProductReviewsController);

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Tạo đánh giá sản phẩm
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - rating
 *             properties:
 *               productId:
 *                 type: integer
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Tạo đánh giá thành công
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post("/", authenticateToken, createReviewController);

export default router;
