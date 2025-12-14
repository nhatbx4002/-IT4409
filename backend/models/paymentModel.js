import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

export const Payment = sequelize.define("payments", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  order_id: DataTypes.INTEGER,
  provider: DataTypes.STRING(50),
  provider_txn_id: DataTypes.STRING(100),
  amount: DataTypes.DECIMAL(12,2),
  currency: { type: DataTypes.STRING(10), defaultValue: "VND" },
  status: DataTypes.STRING(20),
  payment_method: { type: DataTypes.STRING(50), allowNull: true }, // COD, VNPAY, etc
  raw_payload: DataTypes.JSONB,
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  timestamps: true
});

