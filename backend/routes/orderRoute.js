import express from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import {
    createOrder,
    getMyOrders,
    getOrderDetails,
    getShippingFee
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

export default router;