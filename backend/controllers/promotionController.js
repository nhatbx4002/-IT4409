import * as promotionService from "../services/promotionService.js";
import { sendError, sendSuccess } from "./controllerUtils.js";

// [GET] Lấy danh sách Flash Sale
export const getPromotions = async (req, res) => {
  try {
    const data = await promotionService.getActivePromotions();
    sendSuccess(res, { data });
  } catch (error) {
    sendError(res, error, 500);
  }
};

// [POST] Áp dụng mã (Checkout)
export const applyCoupon = async (req, res) => {
  try {
    const { code, cartItems } = req.body;
    const result = await promotionService.calculateDiscount(code, cartItems);
    sendSuccess(res, { data: result });
  } catch (error) {
    sendError(res, error);
  }
};

// [POST - ADMIN] Tạo mã
export const createPromotion = async (req, res) => {
  try {
    const data = await promotionService.createPromotion(req.body);
    sendSuccess(res, { status: 201, message: "Tạo thành công", data });
  } catch (error) {
    sendError(res, error);
  }
};

// [DELETE - ADMIN] Xóa mã
export const deletePromotion = async (req, res) => {
  try {
    await promotionService.deletePromotion(req.params.id);
    sendSuccess(res, { message: "Đã xóa thành công" });
  } catch (error) {
    sendError(res, error, 500);
  }
};