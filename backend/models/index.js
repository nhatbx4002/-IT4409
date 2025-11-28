// Import các models đã được khởi tạo
import { sequelize } from "../config/db.config.js";
import { User } from "./userModel.js";
import { ShippingAddress } from "./shippingAddressModel.js";
import { Category } from "./categoryModel.js";
import { Product } from "./productModel.js";
import { ProductVariant } from "./productVariantModel.js";
import { Cart } from "./cartModel.js";
import { CartItem } from "./cartItemModel.js";
import { Order } from "./orderModel.js";
import { OrderItem } from "./orderItemModel.js";
import { Payment } from "./paymentModel.js";
import { Promotion } from "./promotionModel.js";
import { Review } from "./reviewModel.js";

// ============================================================
// 🔹 Thiết lập các mối quan hệ (Associations)
// (Đây là code đã được cập nhật để thêm 'as' cho Cart)
// ============================================================

// User <-> Cart
User.hasMany(Cart, { foreignKey: 'user_id' });
Cart.belongsTo(User, { foreignKey: 'user_id' });

// Cart <-> CartItem
Cart.hasMany(CartItem, { foreignKey: 'cart_id' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });

// CartItem <-> ProductVariant (CẬP NHẬT)
ProductVariant.hasMany(CartItem, { foreignKey: 'product_variant_id' });
CartItem.belongsTo(ProductVariant, {
  foreignKey: 'product_variant_id',
  as: 'product_variant' // Thêm 'as' để service 'include'
});

// Product <-> ProductVariant (CẬP NHẬT)
Product.hasMany(ProductVariant, {
  foreignKey: 'product_id',
  as: 'variants' // Thêm 'as'
});
ProductVariant.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product' // Thêm 'as' để service 'include'
});

// Category <-> Product
Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

// User <-> Order
User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

// Order <-> OrderItem
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'orderItems' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Order <-> Payment
Order.hasOne(Payment, { foreignKey: 'order_id' });
Payment.belongsTo(Order, { foreignKey: 'order_id' });

// User <-> ShippingAddress
User.hasMany(ShippingAddress, { foreignKey: 'user_id' });
ShippingAddress.belongsTo(User, { foreignKey: 'user_id' });

// Product <-> Review
Product.hasMany(Review, { foreignKey: 'product_id' });
Review.belongsTo(Product, { foreignKey: 'product_id' });

// ============================================================

export {
  sequelize,
  User,
  ShippingAddress,
  Category,
  Product,
  ProductVariant,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Payment,
  Promotion,
  Review,
};