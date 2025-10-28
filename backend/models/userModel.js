import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import { setUpdatedAtHook } from "./hooks.js";

export const User = sequelize.define("users", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING(255),
  full_name: DataTypes.STRING(100),
  phone: DataTypes.STRING(20),
  role: { type: DataTypes.STRING(20), defaultValue: "customer" },
  provider: DataTypes.STRING(50),
  provider_id: DataTypes.STRING(100),
  refresh_token: DataTypes.TEXT,
  access_token: DataTypes.TEXT,
  expires_at: DataTypes.DATE,
  // otp: {type : DataTypes.STRING(20)},
  // otp_expires: {type : DataTypes.DATE},
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

setUpdatedAtHook(User);
