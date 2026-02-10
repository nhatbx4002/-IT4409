import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import { setUpdatedAtHook } from "./hooks.js";

export const Product = sequelize.define("products", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: DataTypes.STRING(255),
  description: DataTypes.TEXT,
  brand: DataTypes.STRING(100),
  material: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: "Chất liệu: Cotton, Polyester, Linen, v.v."
  },
  weight: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "Trọng lượng (gram)"
  },
  care_instructions: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "Hướng dẫn giặt và bảo quản"
  },
  base_price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: {
      min: 0,
      isDecimal: true
    }
  },
  category_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: "categories", key: "id" } },
  images: { type: DataTypes.JSONB, defaultValue: [] },
  status: { type: DataTypes.STRING(20), defaultValue: "active" },
  slug: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: true,
  },
  sale_price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    validate: {
      min: 0,
      isDecimal: true
    }
  },
  is_new: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  tags: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: "Số lượt xem (cache)"
  },
  sold_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: "Số lượng đã bán (cache)"
  },
  average_rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    },
    comment: "Đánh giá trung bình (cache)"
  },
  review_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: "Số lượng reviews"
  },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

setUpdatedAtHook(Product);


// Hook: Tự động xóa product_variant và reviews khi xóa product

Product.beforeDestroy(async (product, options) => {
  try {
    const ProductVariant = sequelize.models.product_variants;
    const Review = sequelize.models.reviews;

    // Xóa tất cả product_variants của product này
    if (ProductVariant) {
      await ProductVariant.destroy({
        where: { product_id: product.id },
        transaction: options.transaction,
      });
    }

    // Xóa tất cả reviews của product này
    if (Review) {
      await Review.destroy({
        where: { product_id: product.id },
        transaction: options.transaction,
      });
    }
  } catch (error) {
    console.error("Error deleting related data:", error);
    throw error;
  }
}),
{
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['category_id'],
      name: 'product_category_idx'
    },
    {
      fields: ['status'],
      name: 'product_status_idx'
    },
    {
      fields: ['slug'],
      unique: true,
      name: 'product_slug_unique'
    },
    {
      fields: ['brand'],
      name: 'product_brand_idx'
    },
    {
      fields: ['created_at'],
      name: 'product_created_idx'
    },
    {
      fields: ['view_count'],
      name: 'product_views_idx'
    },
    {
      fields: ['sold_count'],
      name: 'product_sales_idx'
    },
    {
      fields: ['average_rating'],
      name: 'product_rating_idx'
    }
  ]
};
