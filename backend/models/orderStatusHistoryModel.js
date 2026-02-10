import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

export const OrderStatusHistory = sequelize.define("order_status_history", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'orders',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    from_status: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: "Trạng thái cũ (null nếu là lần đầu tạo)"
    },
    to_status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: "Trạng thái mới"
    },
    changed_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'SET NULL',
        comment: "ID của admin/staff thay đổi (null nếu tự động)"
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Ghi chú lý do thay đổi"
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
    indexes: [
        {
            fields: ['order_id', 'created_at'],
            name: 'order_history_idx'
        },
        {
            fields: ['to_status']
        }
    ]
});