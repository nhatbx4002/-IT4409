import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

export const DiscountUsage = sequelize.define("discount_usages", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    discount_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'discounts',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
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
    discount_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        comment: "Số tiền đã giảm"
    },
    used_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
    indexes: [
        {
            fields: ['discount_id', 'user_id'],
            name: 'discount_user_idx'
        },
        {
            unique: true,
            fields: ['order_id'],
            name: 'unique_order_discount'
        },
        {
            fields: ['used_at']
        }
    ]
});