import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import { setUpdatedAtHook } from "./hooks.js";

export const ProductVariant = sequelize.define("product_variants", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  product_id: DataTypes.INTEGER,
  color: DataTypes.STRING(50),
  size: DataTypes.STRING(20),
  sku: DataTypes.STRING(50),
  price_adjustment: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
  stock_quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
  image_url: DataTypes.TEXT,
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

setUpdatedAtHook(ProductVariant);
