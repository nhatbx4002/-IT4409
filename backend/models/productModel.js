import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import { setUpdatedAtHook } from "./hooks.js";

export const Product = sequelize.define("products", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: DataTypes.STRING(255),
  description: DataTypes.TEXT,
  brand: DataTypes.STRING(100),
  base_price: DataTypes.DECIMAL(12,2),
  category_id: DataTypes.INTEGER,
  images: { type: DataTypes.JSONB, defaultValue: [] },
  status: { type: DataTypes.STRING(20), defaultValue: "active" },
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
});

// Hook: Xóa category nếu không còn product nào sau khi xóa product
Product.afterDestroy(async (product, options) => {
  try {
    const Category = sequelize.models.categories;
    const ProductModel = sequelize.models.products;

    // Nếu product có category_id
    if (product.category_id && Category) {
      // Kiểm tra xem category này còn product nào khác không
      const remainingProducts = await ProductModel.count({
        where: { category_id: product.category_id },
        transaction: options.transaction,
      });

      // Nếu không còn product nào, xóa category
      if (remainingProducts === 0) {
        await Category.destroy({
          where: { id: product.category_id },
          transaction: options.transaction,
        });
        console.log(`✅ Deleted category ${product.category_id} (no products remaining)`);
      }
    }
  } catch (error) {
    console.error("Error checking/deleting category:", error);
    // Không throw error để không ảnh hưởng đến việc xóa product
  }
});