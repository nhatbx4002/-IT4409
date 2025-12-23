import express from "express";
import discountController from "../controllers/discountController.js";

const router = express.Router();

// Public endpoints - no authentication required
/**
 * @swagger
 * /discounts/active:
 *   get:
 *     summary: Lấy danh sách khuyến mãi đang hoạt động
 *     tags: [Discounts]
 *     responses:
 *       200:
 *         description: Danh sách khuyến mãi
 *       500:
 *         description: Lỗi hệ thống
 */
router.get("/active", discountController.getActive);

/**
 * @swagger
 * /discounts/validate/{code}:
 *   get:
 *     summary: Kiểm tra mã khuyến mãi
 *     tags: [Discounts]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kết quả kiểm tra mã
 *       500:
 *         description: Lỗi hệ thống
 */
router.get("/validate/:code", discountController.validateCode);

/**
 * @swagger
 * /discounts/apply:
 *   post:
 *     summary: Áp dụng mã khuyến mãi cho đơn nháp
 *     tags: [Discounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               orderDraft:
 *                 type: object
 *                 properties:
 *                   subtotal:
 *                     type: number
 *                   shipping_fee:
 *                     type: number
 *     responses:
 *       200:
 *         description: Áp dụng mã thành công
 *       500:
 *         description: Lỗi hệ thống
 */
router.post("/apply", discountController.apply);

// Admin endpoints - authentication and admin access handled by parent router in admin/index.js
/**
 * @swagger
 * /admin/discounts:
 *   get:
 *     summary: Danh sách khuyến mãi (Admin)
 *     tags: [Admin, Discounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: apply_type
 *         schema:
 *           type: string
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Danh sách khuyến mãi
 *       403:
 *         description: Access denied
 */
router.get("/", discountController.listDiscounts);

/**
 * @swagger
 * /admin/discounts:
 *   post:
 *     summary: Tạo khuyến mãi mới (Admin)
 *     tags: [Admin, Discounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *               discount_type:
 *                 type: string
 *                 enum: [percentage, fixed_amount, free_shipping]
 *               discount_value:
 *                 type: number
 *               apply_type:
 *                 type: string
 *                 enum: [auto_apply, code]
 *               start_date:
 *                 type: string
 *               end_date:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Tạo khuyến mãi thành công
 *       403:
 *         description: Access denied
 */
router.post("/", discountController.createDiscount);

/**
 * @swagger
 * /admin/discounts/{id}:
 *   put:
 *     summary: Cập nhật khuyến mãi (Admin)
 *     tags: [Admin, Discounts]
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
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *               discount_type:
 *                 type: string
 *                 enum: [percentage, fixed_amount, free_shipping]
 *               discount_value:
 *                 type: number
 *               apply_type:
 *                 type: string
 *                 enum: [auto_apply, code]
 *               start_date:
 *                 type: string
 *               end_date:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Cập nhật khuyến mãi thành công
 *       404:
 *         description: Không tìm thấy khuyến mãi
 *       403:
 *         description: Access denied
 */
router.put("/:id", discountController.updateDiscount);

/**
 * @swagger
 * /admin/discounts/{id}:
 *   delete:
 *     summary: Xóa khuyến mãi (Admin)
 *     tags: [Admin, Discounts]
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
 *         description: Xóa khuyến mãi thành công
 *       404:
 *         description: Không tìm thấy khuyến mãi
 *       403:
 *         description: Access denied
 */
router.delete("/:id", discountController.deleteDiscount);

export default router;
