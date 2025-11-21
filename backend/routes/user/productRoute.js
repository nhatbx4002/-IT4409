import express from "express";
import {
    getProductsByCategoryController,
    getProductDetailController,
    searchProductsController,
} from "../../controllers/user/productController.js";

const router = express.Router();

router.get("/search", searchProductsController);
router.get("/category/:slug", getProductsByCategoryController);
router.get("/:productId", getProductDetailController);

export default router;

