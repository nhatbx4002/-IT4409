import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.js";
import {
  createPaymentController,
  paymentWebhookController,
  paymentCallbackController,
} from "../controllers/paymentController.js";

const router = Router();

/**
 * @swagger
 * /payment/create:
 *   post:
 *     summary: Khởi tạo thanh toán online
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: integer
 *               amount:
 *                 type: number
 *               paymentMethod:
 *                 type: string
 *                 example: VNPAY
 *     responses:
 *       200:
 *         description: Khởi tạo thanh toán thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post("/create", authenticateToken, createPaymentController);

/**
 * @swagger
 * /payment/webhook:
 *   post:
 *     summary: Webhook từ cổng thanh toán (notify_url)
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook nhận thành công
 *       400:
 *         description: Webhook không hợp lệ
 */
router.post("/webhook", paymentWebhookController);

/**
 * @swagger
 * /payment/callback:
 *   get:
 *     summary: Redirect người dùng sau khi thanh toán
 *     tags: [Payment]
 *     parameters:
 *       - in: query
 *         name: vnp_ResponseCode
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect về UI
 */
router.get("/callback", paymentCallbackController);

export default router;

