import express from "express";
import multer from "multer";

import { createProductController, createVariantController, deleteProductController, updateProductController, getAllProductsController, searchProductsController } from "../../controllers/admin/productController.js";

const router = express.Router();
const upload = multer({ dest: "tmp/"})

// Tìm kiếm sản phẩm
router.get("/search", searchProductsController);

// Hiển thị tất cả sản phẩm
router.get("/", getAllProductsController);

// Tạo sản phẩm mới
router.post("/create-product", upload.array("images", 10), createProductController);

// Tạo biến thể cho sản phẩm
router.post("/:productId/variants", upload.array("variantImages", 10), createVariantController);

router.delete("/:productId", deleteProductController);

// Cập nhật sản phẩm (partial update - chỉ update các field được gửi)
router.patch("/update-product/:productId", upload.array("images", 10), updateProductController);

export default router;