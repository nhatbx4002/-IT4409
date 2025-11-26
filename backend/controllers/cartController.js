import * as cartService from '../services/cartService.js';

const getStatusCode = (error) => {
    if (error && Number.isInteger(error.statusCode)) {
        return error.statusCode;
    }
    return 500;
};

/**
 * Lấy chi tiết giỏ hàng
 */
export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await cartService.getCartDetails(userId);

        res.status(200).json({
            success: true,
            message: "Lấy giỏ hàng thành công",
            cart: cart
        });
    } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
        res.status(getStatusCode(error)).json({
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

        res.status(201).json({
            success: true,
            message: "Thêm sản phẩm thành công",
            item: item
        });
    } catch (error) {
        console.error("Lỗi khi thêm sản phẩm vào giỏ:", error);
        res.status(getStatusCode(error)).json({
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
        const { cartItemId } = req.params;
        const { quantity } = req.body;

        const updatedItem = await cartService.updateItemQuantity(userId, cartItemId, quantity);

        res.status(200).json({
            success: true,
            message: "Cập nhật số lượng thành công",
            item: updatedItem
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật số lượng giỏ hàng:", error);
        res.status(getStatusCode(error)).json({
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
        const { cartItemId } = req.params;

        await cartService.removeItemFromCart(userId, cartItemId);

        res.status(200).json({
            success: true,
            message: "Xóa sản phẩm thành công",
        });
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm khỏi giỏ:", error);
        res.status(getStatusCode(error)).json({
            success: false,
            message: error.message
        });
    }
};