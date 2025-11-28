import * as cartService from '../services/cartService.js';

/**
 * Lấy chi tiết giỏ hàng
 */
export const getCart = async (req, res) => {
    try {
        const userId = req.user.id; // Lấy từ middleware authenticateToken
        const cart = await cartService.getCartDetails(userId);

        res.status(200).json({
            success: true,
            message: "Lấy giỏ hàng thành công",
            cart: cart
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Thêm sản phẩm vào giỏ
 */
export const addItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productVariantId, quantity } = req.body;

        const item = await cartService.addProductToCart(userId, productVariantId, quantity);

        res.status(201).json({ // 201 = Created
            success: true,
            message: "Thêm sản phẩm thành công",
            item: item
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Cập nhật số lượng sản phẩm
 */
export const updateItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { cartItemId } = req.params; // Lấy ID item từ URL
        const { quantity } = req.body; // Lấy số lượng mới từ body

        const updatedItem = await cartService.updateItemQuantity(userId, cartItemId, quantity);

        res.status(200).json({
            success: true,
            message: "Cập nhật số lượng thành công",
            item: updatedItem
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Xóa sản phẩm khỏi giỏ
 */
export const removeItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { cartItemId } = req.params; // Lấy ID item từ URL

        await cartService.removeItemFromCart(userId, cartItemId);

        res.status(200).json({
            success: true,
            message: "Xóa sản phẩm thành công",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};