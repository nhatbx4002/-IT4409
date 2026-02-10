import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import { setUpdatedAtHook } from "./hooks.js";

export const Category = sequelize.define("categories", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: DataTypes.STRING(100),
  slug: { type: DataTypes.STRING, unique: true },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "Mô tả category"
  },
  image_url: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "Ảnh đại diện category"
  },
  icon: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: "Icon class hoặc URL"
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: "Category có đang active không"
  },
  parent_id: DataTypes.INTEGER,
  level: { type: DataTypes.INTEGER, defaultValue: 0 },
  sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

setUpdatedAtHook(Category);
