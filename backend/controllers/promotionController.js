import * as promotionService from "../services/promotionService.js";

// [GET] Lấy danh sách Flash Sale
export const getPromotions = async (req, res) => {
  try {
    const data = await promotionService.getActivePromotions();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [POST] Áp dụng mã (Checkout)
export const applyCoupon = async (req, res) => {
  try {
    const { code, cartItems } = req.body;
    const result = await promotionService.calculateDiscount(code, cartItems);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// [POST - ADMIN] Tạo mã
export const createPromotion = async (req, res) => {
  try {
    const data = await promotionService.createPromotion(req.body);
    res.status(201).json({ success: true, message: "Tạo thành công", data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// [DELETE - ADMIN] Xóa mã
export const deletePromotion = async (req, res) => {
  try {
    await promotionService.deletePromotion(req.params.id);
    res.json({ success: true, message: "Đã xóa thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};