import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import { setUpdatedAtHook } from "./hooks.js";

export const Cart = sequelize.define("cart", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: DataTypes.INTEGER,
  session_id: { type: DataTypes.STRING(255), allowNull: true, field: "session_id" },
  is_guest: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false, field: "is_guest" },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

setUpdatedAtHook(Cart);
