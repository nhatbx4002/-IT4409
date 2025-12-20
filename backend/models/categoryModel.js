import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

export const Category = sequelize.define("categories", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: DataTypes.STRING(100),
  slug: DataTypes.STRING,
  parent_id: DataTypes.INTEGER,
  level: { type: DataTypes.INTEGER, defaultValue: 0 },
  sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});
