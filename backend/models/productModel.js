import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import { setUpdatedAtHook } from "./hooks.js";

export const Product = sequelize.define("products", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: DataTypes.STRING(255),
  description: DataTypes.TEXT,
  brand: DataTypes.STRING(100),
  base_price: DataTypes.DECIMAL(12,2),
  category_id: DataTypes.INTEGER,
  images: { type: DataTypes.JSONB, defaultValue: [] },
  status: { type: DataTypes.STRING(20), defaultValue: "active" },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

setUpdatedAtHook(Product);
