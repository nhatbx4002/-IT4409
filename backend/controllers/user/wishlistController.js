import * as wishlistService from "../../services/user/wishlistService.js";
import { sendError, sendSuccess } from "../controllerUtils.js";

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;
    const data = await wishlistService.addWishlist(userId, productId);

    sendSuccess(res, {
      status: 201,
      message: "Đã thêm vào yêu thích!",
      data,
    });
  } catch (error) {
    sendError(res, error);
  }
};

export const getWishlistByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await wishlistService.getWishlist(userId);

    sendSuccess(res, { count: data.length, data });
  } catch (error) {
    sendError(res, error, 500);
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;
    const result = await wishlistService.removeWishlist(userId, productId);

    if (result === 0) {
      const error = new Error("Không tìm thấy để xóa");
      error.status = 404;
      throw error;
    }

    sendSuccess(res, { message: "Đã xóa thành công" });
  } catch (error) {
    sendError(res, error, 500);
  }
};

export const toggleWishlistItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;
    const result = await wishlistService.toggleWishlist(userId, productId);
    const message = result.action === "added" ? "Đã thêm vào yêu thích!" : "Đã xóa khỏi yêu thích!";

    sendSuccess(res, { message, data: result });
  } catch (error) {
    sendError(res, error);
  }
};

export const checkProductInWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const data = await wishlistService.checkWishlistStatus(userId, productId);

    sendSuccess(res, { data });
  } catch (error) {
    sendError(res, error);
  }
};
