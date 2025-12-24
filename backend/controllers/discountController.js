import { Discount } from "../models/index.js";
import * as discountService from "../services/discountService.js";

export const getActive = async (req, res) => {
  try {
    const discounts = await discountService.getActiveDiscounts();
    return res.json({ success: true, data: discounts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const validateCode = async (req, res) => {
  try {
    const { code } = req.params;
    const result = await discountService.validateCode(code);
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const apply = async (req, res) => {
  try {
    const { code, orderDraft } = req.body;
    const result = await discountService.applyDiscount(orderDraft || {}, code);
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin CRUD
export const listDiscounts = async (req, res) => {
  try {
    const filters = {};
    if (req.query.apply_type) filters.apply_type = req.query.apply_type;
    if (req.query.is_active) filters.is_active = req.query.is_active === 'true';

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: discounts } = await Discount.findAndCountAll({
      where: filters,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    return res.json({
      success: true,
      data: {
        items: discounts,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createDiscount = async (req, res) => {
  try {
    const payload = req.body;
    const created = await Discount.create(payload);
    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDiscount = async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body;
    const d = await Discount.findByPk(id);
    if (!d) return res.status(404).json({ success: false, message: 'Not found' });
    await d.update(payload);
    return res.json({ success: true, data: d });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDiscount = async (req, res) => {
  try {
    const id = req.params.id;
    const d = await Discount.findByPk(id);
    if (!d) return res.status(404).json({ success: false, message: 'Not found' });
    await d.destroy();
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getActive,
  validateCode,
  apply,
  listDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
};
