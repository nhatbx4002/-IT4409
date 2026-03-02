import express from "express";
import { authenticateToken } from "../../middlewares/auth.js";
import * as wishlistController from "../../controllers/user/wishlistController.js";

const router = express.Router();

router.use(authenticateToken);

/**
 * @swagger
 * /wishlist/toggle:
 *   post:
 *     summary: Thêm/xóa sản phẩm trong wishlist
 *     tags: [Wishlist]
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
 *             properties:
 *               productId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Toggle wishlist thành công
 *       400:
 *         description: Lỗi thao tác wishlist
 */
router.post("/toggle", wishlistController.toggleWishlistItem);

/**
 * @swagger
 * /wishlist:
 *   get:
 *     summary: Lấy danh sách wishlist của user
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách wishlist
 *       401:
 *         description: Unauthorized
 */
router.get("/", wishlistController.getWishlistByUser);

/**
 * @swagger
 * /wishlist/check/{productId}:
 *   get:
 *     summary: Kiểm tra sản phẩm có trong wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trạng thái wishlist
 */
router.get("/check/:productId", wishlistController.checkProductInWishlist);

/**
 * @swagger
 * /wishlist/remove:
 *   delete:
 *     summary: Xóa sản phẩm khỏi wishlist (legacy)
 *     tags: [Wishlist]
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
 *             properties:
 *               productId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Xóa khỏi wishlist thành công
 *       404:
 *         description: Không tìm thấy sản phẩm trong wishlist
 */
router.delete("/remove", wishlistController.removeFromWishlist);

export default router;
