import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

export const Category = sequelize.define("categories", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: DataTypes.STRING(100),
  slug: DataTypes.STRING,
  parent_id: DataTypes.INTEGER,
});
