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
    getReviewableItems
} from '../controllers/orderController.js';
import { requireEmailVerified } from '../middlewares/requireEmailVerified.js';

const router = express.Router();

// Middleware xác thực cho các route
router.use(authenticateToken);

/**
 * @swagger
 * /shipping-fee:
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
 * /checkout:
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
router.post('/checkout', requireEmailVerified, createOrder);

/**
 * @swagger
 * /:
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
 * /{orderId}/payment/status:
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
 * /{id}:
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
 * /{id}/reviewable-items:
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
 * /{id}/cancel:
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
 * /{id}/reorder:
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
