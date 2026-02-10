import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import { setUpdatedAtHook } from "./hooks.js";

export const ProductVariant = sequelize.define("product_variants", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  product_id: DataTypes.INTEGER,
  color: DataTypes.STRING(100),
  size: DataTypes.STRING(50),
  sku: DataTypes.STRING(200),
  price_adjustment: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
    comment: "Điều chỉnh giá so với base_price (+/-)"
  },

  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: "Variant có đang bán không"
  },
  stock_quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  image_url: DataTypes.TEXT,
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

setUpdatedAtHook(ProductVariant);
