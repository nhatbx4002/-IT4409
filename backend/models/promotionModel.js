import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

export const Promotion = sequelize.define("promotions", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  
  name: { type: DataTypes.STRING, allowNull: false }, // Tên CT (VD: Sale Tết)
  code: { type: DataTypes.STRING, unique: true, allowNull: true }, // Nếu NULL -> Flash Sale tự động
  description: DataTypes.TEXT,

  // Loại giảm giá
  discount_type: { 
    type: DataTypes.ENUM('percentage', 'fixed_amount'), 
    defaultValue: 'fixed_amount' 
  },
  discount_value: { type: DataTypes.DECIMAL(12,2), allowNull: false }, // VD: 10 (%) hoặc 50000 (VND)
  max_discount_amount: DataTypes.DECIMAL(12,2), // Giảm tối đa bao nhiêu (khi dùng %)
  min_order_value: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 }, // Đơn tối thiểu

  // Thời gian
  start_date: DataTypes.DATE, 
  end_date: DataTypes.DATE,
  
  // Giới hạn lượt dùng
  usage_limit: { type: DataTypes.INTEGER, defaultValue: 1000 },
  usage_count: { type: DataTypes.INTEGER, defaultValue: 0 },

  // Phạm vi áp dụng: 'all', 'brand', 'category'
  applicable_to: { 
    type: DataTypes.STRING(20), 
    defaultValue: 'all' 
  },
  // Lưu danh sách ID Brand/Category (Dạng mảng JSON: ["Nike", "Adidas"] hoặc [1, 2])
  target_ids: { 
    type: DataTypes.JSONB, 
    defaultValue: [] 
  },
  
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'promotions',
  timestamps: true
});