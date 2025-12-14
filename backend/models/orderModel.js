import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

export const Order = sequelize.define("orders", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: DataTypes.INTEGER,
  shipping_address_id: DataTypes.INTEGER,
  promotion_id: { type: DataTypes.INTEGER, allowNull: true }, // FK to Promotion
  subtotal_amount: DataTypes.DECIMAL(12,2),
  discount_amount: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
  total_amount: DataTypes.DECIMAL(12,2),
  status: { type: DataTypes.STRING(20), defaultValue: "pending" },
  promotion_code: DataTypes.STRING, // Snapshot of promotion code at order time
  notes: DataTypes.TEXT,
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});
