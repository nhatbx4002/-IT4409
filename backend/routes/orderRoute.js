import express from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import { isAdmin } from '../middlewares/authMiddleware.js';
import {
    createOrder,
    getMyOrders,
    getOrderDetails,
    getShippingFee,
    cancelMyOrder,
    getAllOrders,
    updateStatus,
    vnPayCallback,
    checkPaymentStatus
} from '../controllers/orderController.js';

const router = express.Router();

// === PUBLIC ROUTES (Không cần authenticate) ===
/**
 * @swagger
 * /api/orders/payment/vnpay/callback:
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

// Middleware xác thực cho các route còn lại
router.use(authenticateToken);

/**
 * @swagger
 * /api/orders/shipping-fee:
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
 * /api/orders/checkout:
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
router.post('/checkout', createOrder);

/**
 * @swagger
 * /api/orders:
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
 * /api/orders/{orderId}/payment/status:
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
 * /api/orders/{id}:
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
 * /api/orders/{id}/cancel:
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

// === ADMIN ROUTES ===
// Chỉ Admin mới được truy cập các đường dẫn này

/**
 * @swagger
 * /api/orders/admin/all:
 *   get:
 *     summary: Xem danh sách tất cả đơn hàng (Admin only)
 *     tags: [Orders, Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách tất cả đơn hàng
 *       403:
 *         description: Không có quyền truy cập
 */
router.get('/admin/all', isAdmin, getAllOrders);

/**
 * @swagger
 * /api/orders/admin/{id}/status:
 *   put:
 *     summary: Cập nhật trạng thái đơn hàng (Admin only)
 *     tags: [Orders, Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, PROCESSING, SHIPPING, DELIVERED, CANCELLED]
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *       400:
 *         description: Lỗi cập nhật trạng thái
 *       403:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy đơn hàng
 */
router.put('/admin/:id/status', isAdmin, updateStatus);

export default router;