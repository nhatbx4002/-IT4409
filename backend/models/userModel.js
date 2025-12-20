import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import { setUpdatedAtHook } from "./hooks.js";

export const User = sequelize.define("users", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING(255), // Hashed password
  full_name: DataTypes.STRING(100), // Will be deprecated in favor of name
  name: DataTypes.STRING(100), // New field for user name
  phone: DataTypes.STRING(20),
  role: { type: DataTypes.STRING(20), defaultValue: "customer" },
  is_locked: { type: DataTypes.BOOLEAN, defaultValue: false }, //lock account
  provider: DataTypes.STRING(50),
  provider_id: DataTypes.STRING(100),
  refresh_token: DataTypes.TEXT,
  access_token: DataTypes.TEXT,
  expires_at: DataTypes.DATE,
  token_version: { type: DataTypes.INTEGER, defaultValue: 0 },
  // otp: {type : DataTypes.STRING(20)},
  // otp_expires: {type : DataTypes.DATE},
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

// Define scopes to control which fields are exposed
User.addScope('withoutSecrets', {
  attributes: {
    exclude: ['password', 'refresh_token', 'access_token', 'expires_at']
  }
});

User.addScope('public', {
  attributes: ['id', 'email', 'name', 'phone', 'role', 'provider', 'created_at']
});

setUpdatedAtHook(User);
