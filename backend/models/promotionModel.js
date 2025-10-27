import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

export const Promotion = sequelize.define("promotions", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  code: DataTypes.STRING,
  discount_type: DataTypes.STRING(20),
  discount_value: DataTypes.DECIMAL(12,2),
  start_date: DataTypes.DATEONLY,
  end_date: DataTypes.DATEONLY,
  applicable_to: DataTypes.STRING(20),
  usage_limit: DataTypes.INTEGER,
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});
