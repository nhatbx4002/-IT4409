import express from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import { getCart, addItem, updateItem, removeItem } from '../controllers/cartController.js';

const router = express.Router();

// API: GET /api/cart/
// Lấy chi tiết giỏ hàng của user
router.get('/', authenticateToken, getCart);

// API: POST /api/cart/
// Thêm sản phẩm mới vào giỏ
router.post('/', authenticateToken, addItem);

// API: PUT /api/cart/:cartItemId
// Cập nhật số lượng của một sản phẩm trong giỏ
router.put('/:cartItemId', authenticateToken, updateItem);

// API: DELETE /api/cart/:cartItemId
// Xóa một sản phẩm khỏi giỏ
router.delete('/:cartItemId', authenticateToken, removeItem);

export default router;