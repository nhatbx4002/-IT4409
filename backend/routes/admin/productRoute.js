import express from "express";
import multer from "multer";

import { createProductController, createVariantController, deleteProductController, updateProductController, getAllProductsController, searchProductsController } from "../../controllers/admin/productController.js";

const router = express.Router();
const upload = multer({ dest: "tmp/"})

/**
 * @swagger
 * /admin/products/search:
 *   get:
 *     summary: Tìm kiếm sản phẩm (Admin)
 *     tags: [Admin, Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kết quả tìm kiếm
 */
router.get("/search", searchProductsController);

/**
 * @swagger
 * /admin/products:
 *   get:
 *     summary: Hiển thị tất cả sản phẩm (Admin)
 *     tags: [Admin, Products]
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm
 */
router.get("/", getAllProductsController);

/**
 * @swagger
 * /admin/products/create-product:
 *   post:
 *     summary: Tạo sản phẩm mới (Admin)
 *     tags: [Admin, Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Tạo sản phẩm thành công
 *       400:
 *         description: Lỗi tạo sản phẩm
 */
router.post("/create-product", upload.array("images", 10), createProductController);

/**
 * @swagger
 * /admin/products/{productId}/variants:
 *   post:
 *     summary: Tạo biến thể cho sản phẩm (Admin)
 *     tags: [Admin, Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               variantImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Tạo biến thể thành công
 *       400:
 *         description: Lỗi tạo biến thể
 */
router.post("/:productId/variants", upload.array("variantImages", 10), createVariantController);

/**
 * @swagger
 * /admin/products/{productId}:
 *   delete:
 *     summary: Xóa sản phẩm (Admin)
 *     tags: [Admin, Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa sản phẩm thành công
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.delete("/:productId", deleteProductController);

/**
 * @swagger
 * /admin/products/update-product/{productId}:
 *   patch:
 *     summary: Cập nhật sản phẩm (Admin)
 *     tags: [Admin, Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Cập nhật sản phẩm thành công
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.patch("/update-product/:productId", upload.array("images", 10), updateProductController);

export default router;