import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

export const ProductView = sequelize.define("product_views", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Cho phép null để track anonymous users
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'SET NULL'
    },
    session_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: "Session ID cho anonymous tracking"
    },
    ip_address: {
        type: DataTypes.STRING(45),
        allowNull: true,
        comment: "IP address của viewer"
    },
    user_agent: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Browser user agent"
    },
    viewed_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
    indexes: [
        {
            fields: ['product_id', 'viewed_at'],
            name: 'product_date_idx'
        },
        {
            fields: ['user_id'],
            name: 'user_views_idx'
        },
        {
            fields: ['session_id'],
            name: 'session_idx'
        }
    ]
});