import express from 'express';
import { getCart, addItem, updateItem, removeItem } from '../controllers/cartController.js';
import { verifyAccessToken } from '../services/authService.js';
import { User } from '../models/index.js';

const router = express.Router();

// Optional auth: attach user if token is valid, otherwise continue as guest
router.use(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return next();

  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findByPk(decoded.id);
    if (user) {
      req.user = user;
    }
  } catch (err) {
    // Ignore invalid tokens for guest flows
  }
  next();
});

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
 *     summary: Cập nhật số lượng sản phẩm trong giỏ hàng
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
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
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

export default router;
