import express from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import {
        createOrder,
        getMyOrders,
        getOrderDetails,
        getShippingFee,
        cancelMyOrder,
        checkPaymentStatus,
        reorderMyOrder,
        getReviewableItems,
        vnPayCallback
} from '../controllers/orderController.js';
import { requireEmailVerified } from '../middlewares/requireEmailVerified.js';

const router = express.Router();

// === PUBLIC ROUTES (Không cần authenticate) ===
/**
 * @swagger
 * /orders/payment/vnpay/callback:
 *   get:
 *     summary: Callback từ VNPay sau khi thanh toán
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: vnp_Amount
 *         schema:
 *           type: string
 *       - in: query
 *         name: vnp_BankCode
 *         schema:
 *           type: string
 *       - in: query
 *         name: vnp_ResponseCode
 *         schema:
 *           type: string
 *       - in: query
 *         name: vnp_TransactionStatus
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Callback xử lý thành công
 *       400:
 *         description: Lỗi xử lý callback
 */
router.get('/payment/vnpay/callback', vnPayCallback);

// Alias route for backward compatibility with existing orders
router.get('/vnpay_return', vnPayCallback);

// Middleware xác thực cho các route còn lại
router.use(authenticateToken);

/**
 * @swagger
 * /orders/shipping-fee:
 *   post:
 *     summary: Tính phí ship (Preview)
 *     tags: [Orders]
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
router.post('/shipping-fee', getShippingFee);

/**
 * @swagger
 * /orders/checkout:
 *   post:
 *     summary: Tạo đơn hàng (Checkout)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shippingAddressId
 *               - paymentMethod
 *             properties:
 *               shippingAddressId:
 *                 type: integer
 *               paymentMethod:
 *                 type: string
 *                 enum: [COD, VNPAY]
 *               shippingMethod:
 *                 type: string
 *                 enum: [standard, express]
 *               notes:
 *                 type: string
 *               promotionCode:
 *                 type: string
 *     responses:
 *       201:
 *         description: Đặt hàng thành công
 *       400:
 *         description: Lỗi tạo đơn hàng
 */
router.post('/checkout', requireEmailVerified, createOrder);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Tạo đơn hàng
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shippingAddressId
 *               - paymentMethod
 *             properties:
 *               shippingAddressId:
 *                 type: integer
 *               paymentMethod:
 *                 type: string
 *                 enum: [COD, VNPAY]
 *               shippingMethod:
 *                 type: string
 *                 enum: [standard, express]
 *               notes:
 *                 type: string
 *               promotionCode:
 *                 type: string
 *     responses:
 *       201:
 *         description: Đặt hàng thành công
 *       400:
 *         description: Lỗi tạo đơn hàng
 */
router.post('/', requireEmailVerified, createOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Xem danh sách đơn hàng của user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
 *       401:
 *         description: Unauthorized
 */
router.get('/', getMyOrders);

/**
 * @swagger
 * /orders/{orderId}/payment/status:
 *   get:
 *     summary: Kiểm tra trạng thái thanh toán
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trạng thái thanh toán
 *       404:
 *         description: Không tìm thấy đơn hàng
 */
router.get('/:orderId/payment/status', checkPaymentStatus);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Xem chi tiết đơn hàng
 *     tags: [Orders]
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
 *         description: Chi tiết đơn hàng
 *       404:
 *         description: Không tìm thấy đơn hàng
 */
router.get('/:id', getOrderDetails);

/**
 * @swagger
 * /orders/{id}/reviewable-items:
 *   get:
 *     summary: Danh sách sản phẩm trong đơn hàng mà user được phép đánh giá
 *     tags: [Orders]
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
 *         description: Danh sách sản phẩm có thể đánh giá
 *       400:
 *         description: Đơn hàng chưa được giao hoặc không hợp lệ
 *       404:
 *         description: Không tìm thấy đơn hàng
 */
router.get('/:id/reviewable-items', getReviewableItems);

/**
 * @swagger
 * /orders/{id}/cancel:
 *   put:
 *     summary: Hủy đơn hàng
 *     tags: [Orders]
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
 *         description: Hủy đơn hàng thành công
 *       400:
 *         description: Không thể hủy đơn hàng
 *       404:
 *         description: Không tìm thấy đơn hàng
 */
router.put('/:id/cancel', cancelMyOrder);

/**
 * @swagger
 * /orders/{id}/reorder:
 *   post:
 *     summary: Đặt lại đơn hàng (thêm lại các sản phẩm vào giỏ)
 *     tags: [Orders]
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
 *         description: Đã thêm lại sản phẩm vào giỏ hàng
 *       404:
 *         description: Không tìm thấy đơn hàng
 */
router.post('/:id/reorder', reorderMyOrder);

export default router;
