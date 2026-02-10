import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import { setUpdatedAtHook } from "./hooks.js";

export const OrderItem = sequelize.define("order_items", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  order_id: DataTypes.INTEGER,
  product_id: DataTypes.INTEGER,
  product_variant_id: DataTypes.INTEGER,
  name_snapshot: DataTypes.STRING(255),
  sku_snapshot: DataTypes.STRING(200),
  color_snapshot: DataTypes.STRING(50),
  size_snapshot: DataTypes.STRING(20),
  unit_price: DataTypes.DECIMAL(12, 2),
  quantity: DataTypes.INTEGER,
  line_total: DataTypes.DECIMAL(12, 2),
  discount_amount: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
    comment: "Giảm giá riêng cho item này (flash sale, deal đặc biệt)"
  },
  final_price: {
    type: DataTypes.DECIMAL(12, 2),
    comment: "Giá cuối cùng = line_total - discount_amount"
  },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

OrderItem.afterCreate(async (orderItem) => {
  try {
    // Chỉ update nếu order đã confirmed
    const order = await Order.findByPk(orderItem.order_id);
    if (order && order.status === 'confirmed') {
      const { updateProductCache } = await import('../utils/productCacheHelper.js');
      await updateProductCache(orderItem.product_id);
    }
  } catch (error) {
    console.error('Error in afterCreate hook:', error);
  }
});
setUpdatedAtHook(OrderItem);
