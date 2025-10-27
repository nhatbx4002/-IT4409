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

// ===== Associations =====
User.hasMany(Cart);
Cart.belongsTo(User);

Cart.hasMany(CartItem);
CartItem.belongsTo(Cart);

Product.belongsTo(Category);
Category.hasMany(Product);

Product.hasMany(ProductVariant);
ProductVariant.belongsTo(Product);

Order.belongsTo(User);
User.hasMany(Order);

Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

Order.hasOne(Payment);
Payment.belongsTo(Order);

User.hasMany(ShippingAddress);
ShippingAddress.belongsTo(User);

Product.hasMany(Review);
Review.belongsTo(Product);

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
