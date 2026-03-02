import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.js";
import { validateCheckoutController } from "../controllers/checkoutController.js";
import { getCart } from "../controllers/cartController.js";
import { getShippingFee } from "../controllers/orderController.js";

const router = Router();

/**
 * @swagger
 * /checkout/cart:
 *   get:
 *     summary: Lấy cart hiện tại để checkout
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart hiện tại
 *       401:
 *         description: Unauthorized
 */
router.get("/cart", authenticateToken, getCart);

/**
 * @swagger
 * /checkout/calculate-shipping:
 *   post:
 *     summary: Tính phí ship theo địa chỉ + phương thức
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - province_id
 *               - district_id
 *             properties:
 *               province_id:
 *                 type: string
 *               district_id:
 *                 type: string
 *               promotionCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tính phí ship thành công
 *       400:
 *         description: Lỗi tính phí ship
 */
router.post("/calculate-shipping", authenticateToken, getShippingFee);

/**
 * @swagger
 * /checkout/validate:
 *   post:
 *     summary: Kiểm tra dữ liệu checkout trước khi đặt hàng
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shippingAddressId:
 *                 type: integer
 *                 description: ID địa chỉ lưu trong tài khoản
 *               shippingAddress:
 *                 type: object
 *                 description: Địa chỉ giao hàng thủ công
 *               paymentMethod:
 *                 type: string
 *               promotionCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Dữ liệu checkout hợp lệ
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post("/validate", authenticateToken, validateCheckoutController);

export default router;
