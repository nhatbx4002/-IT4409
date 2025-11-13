import { getProductsByCategoryService, getProductDetailService, searchProductsService } from "../../services/user/productService.js";

export const getProductsByCategoryController = async (req, res) => {
    const { categoryId } = req.query;
    const { slug } = req.params;
    const { name } = req.query;
    const includeDescendants = req.query.includeDescendants !== "false";

    try {
        const result = await getProductsByCategoryService({
            categoryId: categoryId ? Number(categoryId) : undefined,
            categorySlug: slug,
            categoryName: name,
            includeDescendants,
        });

        return res.status(200).json({
            success: true,
            data: result,
            message: "Products fetched successfully",
        });
    } catch (error) {
        const statusCode = error.message === "Category not found" ? 404 : 400;
        return res.status(statusCode).json({
            success: false,
            message: error.message || "Failed to fetch products",
        });
    }
};

export const getProductDetailController = async (req, res) => {
    const { productId } = req.params;

    try {
        const data = await getProductDetailService(Number(productId));
        return res.status(200).json({
            success: true,
            data,
            message: "Product detail fetched successfully",
        });
    } catch (error) {
        const statusCode =
            error.message === "Product not found" ? 404 : 400;
        return res.status(statusCode).json({
            success: false,
            message: error.message || "Failed to fetch product detail",
        });
    }
};

export const searchProductsController = async (req, res) => {
    const { q, name, brand } = req.query;

    try {
        const result = await searchProductsService({
            name: name || q || undefined,
            brand: brand || q || undefined,
        });

        return res.status(200).json({
            success: true,
            data: result,
            message: "Search products successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to search products",
            error: error.message,
        });
    }
};

