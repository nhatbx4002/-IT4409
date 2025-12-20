import { Op } from "sequelize";
import {
  Discount,
} from "../models/index.js";

function now() {
  return new Date();
}

function calculateDiscountAmount(discount, subtotal = 0, shippingFee = 0) {
  if (!discount) return 0;
  const type = discount.discount_type;
  const value = parseFloat(discount.discount_value || 0);
  let amount = 0;

  if (type === "percentage") {
    amount = (subtotal * value) / 100;
    if (discount.max_discount_amount) {
      amount = Math.min(amount, parseFloat(discount.max_discount_amount));
    }
  } else if (type === "fixed_amount") {
    amount = value;
  } else if (type === "free_shipping") {
    amount = shippingFee || 0;
  }

  return Math.max(0, parseFloat(amount.toFixed(2)));
}

export async function getActiveDiscounts() {
  const nowDate = now();
  const discounts = await Discount.findAll({
    where: {
      is_active: true,
      start_date: { [Op.lte]: nowDate },
      end_date: { [Op.gte]: nowDate },
      usage_count: { [Op.lt]: Discount.sequelize.literal("COALESCE(usage_limit, 9999999)") },
    },
  });
  return discounts;
}

export async function validateCode(code) {
  if (!code) return { valid: false, reason: "empty" };
  const nowDate = now();
  const discount = await Discount.findOne({ where: { code, is_active: true } });
  if (!discount) return { valid: false, reason: "not_found" };
  if (discount.start_date && discount.start_date > nowDate) return { valid: false, reason: "not_started" };
  if (discount.end_date && discount.end_date < nowDate) return { valid: false, reason: "expired" };
  if (discount.usage_limit && discount.usage_count >= discount.usage_limit) return { valid: false, reason: "exhausted" };
  return { valid: true, discount };
}

export async function getBestAutoDiscount(orderDraft) {
  const subtotal = parseFloat(orderDraft.subtotal || 0);
  const shippingFee = parseFloat(orderDraft.shipping_fee || 0);
  const nowDate = now();

  const discounts = await Discount.findAll({
    where: {
      is_active: true,
      apply_type: "auto_apply",
      start_date: { [Op.lte]: nowDate },
      end_date: { [Op.gte]: nowDate },
      usage_count: { [Op.lt]: Discount.sequelize.literal("COALESCE(usage_limit, 9999999)") },
    },
  });

  let best = null;
  let bestAmount = 0;
  for (const d of discounts) {
    // Basic min order check
    if (d.min_order_value && subtotal < parseFloat(d.min_order_value)) continue;
    const amount = calculateDiscountAmount(d, subtotal, shippingFee);
    if (amount > bestAmount) {
      bestAmount = amount;
      best = d;
    }
  }

  return { discount: best, amount: bestAmount };
}

export async function applyDiscount(orderDraft, code) {
  const subtotal = parseFloat(orderDraft.subtotal || 0);
  const shippingFee = parseFloat(orderDraft.shipping_fee || 0);

  if (code) {
    const res = await validateCode(code);
    if (!res.valid) return { applied: false, reason: res.reason };
    const amount = calculateDiscountAmount(res.discount, subtotal, shippingFee);
    const snapshot = {
      discount_code_snapshot: res.discount.code || null,
      discount_type_snapshot: res.discount.discount_type,
      discount_value_snapshot: res.discount.discount_value,
    };
    return { applied: true, amount, discount: res.discount, snapshot };
  }

  const { discount, amount } = await getBestAutoDiscount(orderDraft);
  if (!discount) return { applied: false, reason: "no_auto_available" };

  const snapshot = {
    discount_code_snapshot: discount.code || null,
    discount_type_snapshot: discount.discount_type,
    discount_value_snapshot: discount.discount_value,
  };

  return { applied: true, amount, discount, snapshot };
}

export async function validateAndReserveDiscount(code, transaction) {
  if (!code) return { valid: false, reason: "empty" };

  const nowDate = now();
  const discount = await Discount.findOne({
    where: { code, is_active: true },
    lock: transaction?.LOCK?.UPDATE,
    transaction,
  });

  if (!discount) return { valid: false, reason: "not_found" };
  if (discount.start_date && discount.start_date > nowDate) return { valid: false, reason: "not_started" };
  if (discount.end_date && discount.end_date < nowDate) return { valid: false, reason: "expired" };

  if (discount.usage_limit && discount.usage_count >= discount.usage_limit) {
    return { valid: false, reason: "exhausted" };
  }

  // Increment inside the same transaction to reserve the slot
  await discount.increment("usage_count", { by: 1, transaction });

  return { valid: true, discount };
}

export default {
  getActiveDiscounts,
  validateCode,
  getBestAutoDiscount,
  applyDiscount,
  validateAndReserveDiscount,
};
