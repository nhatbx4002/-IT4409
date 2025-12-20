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
  Discount,
  Review,
  Wishlist,
} from "./models/index.js";

loadEnv();

// Sync strategy can be controlled with env var `SYNC_STRATEGY` or legacy `DISCOUNT_SYNC_STRATEGY`.
// Allowed values: 'force' (drops & recreates), 'alter' (safer schema adjust). Default: 'alter'.
const syncStrategy = process.env.SYNC_STRATEGY || process.env.DISCOUNT_SYNC_STRATEGY || "alter";

async function syncModel(model, label) {
  console.log(`🔄 Syncing ${label} table (strategy=${syncStrategy})...`);
  if (syncStrategy === "force") {
    await model.sync({ force: true });
  } else if (syncStrategy === "alter") {
    await model.sync({ alter: true });
  } else {
    await model.sync();
  }
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
    await syncModel(Discount, "Discount");
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

