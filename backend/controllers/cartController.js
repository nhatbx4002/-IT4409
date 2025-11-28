import * as cartService from '../services/cartService.js';
import { sendError, sendSuccess } from "./controllerUtils.js";

/**
 * Lấy chi tiết giỏ hàng
 */
export const getCart = async (req, res) => {
    try {
        const userId = req.user.id; // Lấy từ middleware authenticateToken
        const cart = await cartService.getCartDetails(userId);

        sendSuccess(res, {
            message: "Lấy giỏ hàng thành công",
            cart,
        });
    } catch (error) {
        sendError(res, error);
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

        sendSuccess(res, {
            status: 201, // Created
            message: "Thêm sản phẩm thành công",
            item,
        });
    } catch (error) {
        sendError(res, error);
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

        sendSuccess(res, {
            message: "Cập nhật số lượng thành công",
            item: updatedItem,
        });
    } catch (error) {
        sendError(res, error);
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

        sendSuccess(res, { message: "Xóa sản phẩm thành công" });
    } catch (error) {
        sendError(res, error);
    }
};