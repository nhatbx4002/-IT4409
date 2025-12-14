import express from "express";
import {
    getProductsByCategoryController,
    getProductDetailController,
    searchProductsController,
} from "../../controllers/user/productController.js";

const router = express.Router();

/**
 * @swagger
 * /user/products/search:
 *   get:
 *     summary: Tìm kiếm sản phẩm
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kết quả tìm kiếm sản phẩm
 */
router.get("/search", searchProductsController);

/**
 * @swagger
 * /user/products/category/{slug}:
 *   get:
 *     summary: Lấy sản phẩm theo danh mục
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm theo danh mục
 *       404:
 *         description: Không tìm thấy danh mục
 */
router.get("/category/:slug", getProductsByCategoryController);

/**
 * @swagger
 * /user/products/{productId}:
 *   get:
 *     summary: Lấy chi tiết sản phẩm
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chi tiết sản phẩm
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.get("/:productId", getProductDetailController);

export default router;

