import express from "express";
import {
  listProductsController,
  searchProductsController,
  getProductDetailBySlugOrIdController,
  getSimilarProductsController,
  trackProductViewController,
} from "../controllers/user/productController.js";

const router = express.Router();

router.get("/", listProductsController);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: List products with pagination, sorting, and filters
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Current page index
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 12
 *         description: Page size (aka limit)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [featured, newest, price-low, price-high, popular]
 *           default: featured
 *         description: Sort strategy
 *       - in: query
 *         name: collection
 *         schema:
 *           type: string
 *           enum: [men, women, accessories]
 *         description: Filter by collection
 *       - in: query
 *         name: categorySlug
 *         schema:
 *           type: string
 *         description: Filter by a single category slug
 *       - in: query
 *         name: categorySlugs
 *         schema:
 *           type: string
 *         description: Comma separated list of category slugs
 *       - in: query
 *         name: sizes
 *         schema:
 *           type: string
 *         description: Comma separated list of sizes
 *       - in: query
 *         name: colors
 *         schema:
 *           type: string
 *         description: Comma separated list of colors
 *       - in: query
 *         name: priceMin
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: priceMax
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: brands
 *         schema:
 *           type: string
 *         description: Comma separated list of brands
 *       - in: query
 *         name: inStockOnly
 *         schema:
 *           type: boolean
 *         description: Only return products that are in stock
 *     responses:
 *       200:
 *         description: Paged product list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         pageSize:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Search products with pagination, sorting, and filters
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Free text search across product fields (name, brand, description, tags)
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by product name (or description/tags due to shared search logic)
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filter by brand (or description/tags due to shared search logic)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 12
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [featured, newest, price-low, price-high, popular]
 *           default: featured
 *         description: Sort strategy
 *       - in: query
 *         name: collection
 *         schema:
 *           type: string
 *           enum: [men, women, accessories]
 *       - in: query
 *         name: categorySlug
 *         schema:
 *           type: string
 *       - in: query
 *         name: categorySlugs
 *         schema:
 *           type: string
 *         description: Comma separated list of category slugs
 *       - in: query
 *         name: sizes
 *         schema:
 *           type: string
 *         description: Comma separated list of sizes
 *       - in: query
 *         name: colors
 *         schema:
 *           type: string
 *       - in: query
 *         name: priceMin
 *         schema:
 *           type: number
 *       - in: query
 *         name: priceMax
 *         schema:
 *           type: number
 *       - in: query
 *         name: brands
 *         schema:
 *           type: string
 *         description: Comma separated list of brands
 *       - in: query
 *         name: inStockOnly
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Search results with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         pageSize:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                 message:
 *                   type: string
 */
router.get("/search", searchProductsController);

/**
 * @swagger
 * /products/{slugOrId}/views:
 *   post:
 *     summary: Track a product view
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slugOrId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               session_id:
 *                 type: string
 *                 description: Optional session id for anonymous tracking
 *     responses:
 *       204:
 *         description: View tracked
 *       404:
 *         description: Product not found
 */
router.post("/:slugOrId/views", trackProductViewController);

/**
 * @swagger
 * /products/{slugOrId}/similar:
 *   get:
 *     summary: Get similar products
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slugOrId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 4
 *     responses:
 *       200:
 *         description: Similar products list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 message:
 *                   type: string
 *       404:
 *         description: Product not found
 */
router.get("/:slugOrId/similar", getSimilarProductsController);

/**
 * @swagger
 * /products/{slugOrId}:
 *   get:
 *     summary: Get product detail by slug or id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slugOrId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product detail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *       404:
 *         description: Product not found
 */
router.get("/:slugOrId", getProductDetailBySlugOrIdController);

export default router;
