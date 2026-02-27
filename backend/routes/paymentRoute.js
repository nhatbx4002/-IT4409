import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.js";
import {
  createPaymentController,
  paymentWebhookController,
  paymentCallbackController,
} from "../controllers/paymentController.js";

const router = Router();

/**
 * POST /api/payment/create
 * Khởi tạo thanh toán online (VNPay, sau này có thể mở rộng)
 */
router.post("/create", authenticateToken, createPaymentController);

/**
 * POST /api/payment/webhook
 * Webhook từ cổng thanh toán (notify_url)
 */
router.post("/webhook", paymentWebhookController);

/**
 * GET /api/payment/callback
 * User return_url – chỉ redirect UI (không xử lý thanh toán)
 */
router.get("/callback", paymentCallbackController);

export default router;

