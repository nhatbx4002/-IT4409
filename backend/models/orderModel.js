import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

export const Order = sequelize.define("orders", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: DataTypes.INTEGER,
  shipping_address_id: DataTypes.INTEGER,
  discount_id: { type: DataTypes.INTEGER, allowNull: true }, // FK to unified Discount table
  order_number: { type: DataTypes.STRING(50), unique: true, allowNull: true },
  subtotal_amount: DataTypes.DECIMAL(12, 2),
  discount_amount: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  shipping_fee: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
    allowNull: false,
    comment: "Phí vận chuyển"
  },
  total_amount: DataTypes.DECIMAL(12, 2),
  status: {
    type: DataTypes.ENUM('pending',      // Chờ xác nhận
      'confirmed',    // Đã xác nhận
      'processing',   // Đang chuẩn bị
      'shipping',     // Đang vận chuyển
      'delivered',    // Đã giao
      'cancelled',    // Đã hủy
      'returned',     // Đã trả hàng
      'refunded'      // Đã hoàn tiền 
    ),
    defaultValue: 'pending',
    allowNull: false,
    comment: "Trạng thái đơn hàng"
  },
  discount_code_snapshot: DataTypes.STRING,
  discount_type_snapshot: DataTypes.STRING,
  discount_value_snapshot: DataTypes.DECIMAL(12, 2),
  notes: DataTypes.TEXT,
  payment_method: { type: DataTypes.ENUM('cod', 'bank_transfer', 'vnpay'), allowNull: true, comment: "Phương thức thanh toán" },
  shipping_method: {
    type: DataTypes.ENUM('standard', 'express'),
    defaultValue: 'standard',
    comment: "Phương thức vận chuyển"
  },
  estimated_delivery_date: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: "Ngày giao hàng dự kiến"
  },
  actual_delivery_date: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: "Ngày giao hàng thực tế"
  },
  tracking_number: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: "Mã vận đơn"
  },
  cancelled_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cancel_reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    {
      fields: ['user_id'],
      name: 'order_user_idx'
    },
    {
      fields: ['order_number'],
      unique: true,
      name: 'order_number_unique'
    },
    {
      fields: ['status'],
      name: 'order_status_idx'
    },
    {
      fields: ['created_at'],
      name: 'order_created_idx'
    },
    {
      fields: ['user_id', 'status'],
      name: 'user_status_idx'
    }
  ]
});
