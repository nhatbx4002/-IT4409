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
// Sửa lại import Wishlist cho đồng bộ (có ngoặc nhọn nếu export const, không ngoặc nếu export default)
// Dựa trên code cũ của bạn là 'export default Wishlist', nên import thế này là đúng:
import Wishlist from "./wishlistModel.js"; 

// ============================================================
// 🔹 Thiết lập các mối quan hệ (Associations)

// ===== Associations =====
User.hasMany(Cart);
Cart.belongsTo(User);

Cart.hasMany(CartItem);
CartItem.belongsTo(Cart);

// --- ĐÃ SỬA ĐOẠN XUNG ĐỘT TẠI ĐÂY ---
// Giữ lại đoạn có foreignKey rõ ràng và có Wishlist
Product.belongsTo(Category, { foreignKey: 'category_id' });
Category.hasMany(Product, { foreignKey: 'category_id' });

// Quan hệ Wishlist (Bắt buộc phải có để tính năng Wishlist chạy)
Wishlist.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Wishlist.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
// ------------------------------------

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
  Promotion, // Đã có Promotion
  Review,
  Wishlist   // Đã có Wishlist
};