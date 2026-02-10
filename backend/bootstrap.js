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
  Collection,
  ProductCollection,
} from "./models/index.js";

loadEnv();

// Sync strategy can be controlled with env var `SYNC_STRATEGY` or legacy `DISCOUNT_SYNC_STRATEGY`.
// Allowed values: 'force' (drops & recreates), 'alter' (safer schema adjust). Default: 'alter'.
const syncStrategy = process.env.SYNC_STRATEGY || process.env.DISCOUNT_SYNC_STRATEGY || "alter";

async function syncModel(model, label) {
  if (syncStrategy === "force") {
    await model.sync({ force: true });
  } else if (syncStrategy === "alter") {
    await model.sync({ alter: true });
  } else {
    await model.sync();
  }
}

export async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ DB connection failed", err);
    process.exit(1);
  }
}
export const startServer = async () => {
  await initDatabase();
};

