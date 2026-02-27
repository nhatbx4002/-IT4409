import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import { setUpdatedAtHook } from "./hooks.js";

export const User = sequelize.define("users", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: {
        msg: "Email không hợp lệ"
      }
    }
  },
  password: DataTypes.STRING(255),
  name: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: null
  },
  phone: DataTypes.STRING(20),
  role: { type: DataTypes.STRING(20), defaultValue: "customer" },
  is_locked: { type: DataTypes.BOOLEAN, defaultValue: false }, //lock account
  provider: DataTypes.STRING(50),
  provider_id: DataTypes.STRING(100),
  refresh_token: DataTypes.TEXT,
  token_version: { type: DataTypes.INTEGER, defaultValue: 0 },
  avatar_url: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "URL ảnh đại diện"
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: "Ngày sinh"
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: true,
    comment: "Giới tính"
  },
  last_login_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: "Lần đăng nhập cuối"
  },
  reset_otp: {
    type: DataTypes.STRING(6),
    allowNull: true,
    comment: "OTP code for password reset"
  },
  reset_otp_expires: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: "OTP expiration time"
  },
  email_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  email_verification_token: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});


User.addScope('withoutSecrets', {
  attributes: {
    exclude: ['password', 'refresh_token']
  }
});

User.addScope('public', {
  attributes: ['id', 'email', 'name', 'phone', 'role', 'provider', 'created_at']
});

setUpdatedAtHook(User);
