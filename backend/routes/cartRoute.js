import express from 'express';
import { getCart, addItem, updateItem, removeItem } from '../controllers/cartController.js';
import discountController from '../controllers/discountController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Require authentication for all cart routes
router.use(authenticateToken);

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Lấy chi tiết giỏ hàng của user
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chi tiết giỏ hàng
 *       401:
 *         description: Unauthorized
 */
router.get('/', getCart);

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Thêm sản phẩm mới vào giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Thêm sản phẩm thành công
 *       400:
 *         description: Lỗi thêm sản phẩm
 */
router.post('/', addItem);

/**
 * @swagger
 * /cart/{cartItemId}:
 *   put:
 *     summary: Cập nhật số lượng hoặc biến thể sản phẩm trong giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *               productVariantId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Lỗi cập nhật
 *       404:
 *         description: Không tìm thấy sản phẩm trong giỏ
 */
router.put('/:cartItemId', updateItem);

/**
 * @swagger
 * /cart/{cartItemId}:
 *   delete:
 *     summary: Xóa sản phẩm khỏi giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa sản phẩm thành công
 *       404:
 *         description: Không tìm thấy sản phẩm trong giỏ
 */
router.delete('/:cartItemId', removeItem);

/**
 * Discount endpoints scoped dưới /cart để khớp với spec
 *
 * POST /api/cart/discount/validate
 * Body: { code: string, cart_items?: [...] }
 *
 * POST /api/cart/discount/apply
 * Body: { code?: string, orderDraft: { subtotal, shipping_fee, cart_items } }
 *
 * DELETE /api/cart/discount
 * Chỉ dùng cho FE xoá mã giảm giá khỏi cart (không thay đổi DB)
 */

// Validate discount code cho cart hiện tại
router.post('/discount/validate', (req, res) => {
  const { code, cart_items } = req.body || {};
  if (!code) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng nhập mã giảm giá',
    });
  }

  // Gắn code vào params để tái sử dụng discountController.validateCode
  req.params.code = code;
  req.body.cart_items = cart_items || [];
  return discountController.validateCode(req, res);
});

// Áp dụng mã giảm giá cho order draft
router.post('/discount/apply', (req, res) => {
  return discountController.apply(req, res);
});

// Xoá mã giảm giá khỏi cart (FE chỉ cần response OK để reset UI)
router.delete('/discount', (req, res) => {
  return res.json({
    success: true,
    message: 'Đã xoá mã giảm giá khỏi giỏ hàng',
  });
});

export default router;
