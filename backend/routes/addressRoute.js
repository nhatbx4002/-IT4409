import express from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import { addAddress, getMyAddresses, deleteAddress } from '../controllers/addressController.js';

const router = express.Router();

// Tất cả API này đều cần đăng nhập
router.use(authenticateToken);

// GET /api/addresses -> Lấy list để hiển thị (như Shopee)
router.get('/', getMyAddresses);

// POST /api/addresses -> Thêm mới (khi user nhập form mới)
router.post('/', addAddress);

// DELETE /api/addresses/:id -> Xóa
router.delete('/:id', deleteAddress);

export default router;