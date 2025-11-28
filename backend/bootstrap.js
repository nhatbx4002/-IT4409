import { loadEnv } from "./config/env.js";
import {
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
  Wishlist,
} from "./models/index.js";

loadEnv();

async function syncModel(model, label) {
  console.log(`🔄 Syncing ${label} table...`);
  await model.sync({ alter: true });
  console.log(`✅ ${label} table synced`);
}

async function initDatabase() {
  try {
    console.log("🔄 Connecting to database...");
    await sequelize.authenticate();
    console.log("✅ Database connected!");

    await syncModel(User, "User");
    await syncModel(Category, "Category");
    await syncModel(ShippingAddress, "ShippingAddress");
    await syncModel(Cart, "Cart");
    await syncModel(Order, "Order");
    await syncModel(Product, "Product");
    await syncModel(ProductVariant, "ProductVariant");
    await syncModel(Review, "Review");
    await syncModel(CartItem, "CartItem");
    await syncModel(OrderItem, "OrderItem");
    await syncModel(Payment, "Payment");

    try {
      await syncModel(Promotion, "Promotion");
    } catch (promoError) {
      console.warn("⚠️ Promotion table sync skipped:", promoError.message);
    }

    await syncModel(Wishlist, "Wishlist");
    console.log("✅ All tables synced successfully!");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    console.error("Error details:", error.message);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  }
}

export const startServer = async () => {
  await initDatabase();
};

