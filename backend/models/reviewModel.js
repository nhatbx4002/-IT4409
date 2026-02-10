import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import { setUpdatedAtHook } from "./hooks.js";

export const Review = sequelize.define("reviews", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: DataTypes.INTEGER,
  product_id: DataTypes.INTEGER,
  order_item_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'order_items',
      key: 'id'
    },
    onDelete: 'SET NULL',
    comment: "Review từ order item nào (verify mua hàng thật)"
  },
  is_verified_purchase: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: "Đã xác thực mua hàng chưa"
  },
  helpful_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: "Số người thấy review hữu ích"
  },
  is_approved: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: "Admin duyệt review chưa (moderation)"
  },
  admin_reply: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "Phản hồi từ admin/shop"
  },
  rating: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: DataTypes.TEXT,
  images: { type: DataTypes.JSONB, defaultValue: [] },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['product_id'],
      name: 'review_product_idx'
    },
    {
      fields: ['user_id'],
      name: 'review_user_idx'
    },
    {
      fields: ['is_approved'],
      name: 'review_approved_idx'
    },
    {
      fields: ['product_id', 'is_approved'],
      name: 'product_approved_reviews_idx'
    },
    {
      fields: ['rating'],
      name: 'review_rating_idx'
    }
  ]
});

setUpdatedAtHook(Review);
// Auto update product cache khi có review mới
Review.afterCreate(async (review) => {
  try {
    const { updateProductCache } = await import('../utils/productCacheHelper.js');
    await updateProductCache(review.product_id);
  } catch (error) {
    console.error('Error in afterCreate hook:', error);
  }
});

Review.afterDestroy(async (review) => {
  try {
    const { updateProductCache } = await import('../utils/productCacheHelper.js');
    await updateProductCache(review.product_id);
  } catch (error) {
    console.error('Error in afterDestroy hook:', error);
  }
});
