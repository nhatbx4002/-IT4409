import express from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import { isAdmin } from '../middlewares/authMiddleware.js';
import {
    createOrder,
    getMyOrders,
    getOrderDetails,
    getShippingFee,
    cancelMyOrder,
    getAllOrders, updateStatus
} from '../controllers/orderController.js';

const router = express.Router();

// Middleware xác thực cho toàn bộ route đơn hàng
router.use(authenticateToken);

// API: Tính phí ship (Preview)
// POST /api/orders/shipping-fee
router.post('/shipping-fee', getShippingFee);

// API: Tạo đơn hàng (Checkout)
// POST /api/orders/checkout
router.post('/checkout', createOrder);

// API: Xem danh sách đơn hàng
// GET /api/orders/
router.get('/', getMyOrders);

// API: Xem chi tiết đơn hàng
// GET /api/orders/:id
router.get('/:id', getOrderDetails);

// API: Hủy đơn hàng
// PUT /api/orders/:id/cancel
router.put('/:id/cancel', cancelMyOrder);

// === ADMIN ROUTES ===
// Chỉ Admin mới được truy cập các đường dẫn này

// 1. Xem danh sách tất cả đơn hàng
// GET /api/orders/admin/all
router.get('/admin/all', isAdmin, getAllOrders);

// 2. Cập nhật trạng thái đơn hàng
// PUT /api/orders/admin/:id/status
router.put('/admin/:id/status', isAdmin, updateStatus);

export default router;