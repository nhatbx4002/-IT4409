import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { buildCorsOptions } from "./config/cors.js";
import { loadEnv } from "./config/env.js";
import "./config/google.config.js";
import "./config/facebook.config.js";
import { requestLogger } from "./middlewares/logger.js";
import { sessionConfig } from "./services/authService.js";
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
  Wishlist
} from "./models/index.js";

loadEnv();

const app = express();

// ==============================
// MIDDLEWARE
// ==============================

app.use(cors(buildCorsOptions()));
app.use(express.json());
app.use(requestLogger());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("❌ Invalid JSON:", err.message);
    return res.status(400).json({
      success: false,
      error: "Invalid JSON format",
      message: "Please check your request body",
      detail: err.message
    });
  }
  next();
});

// Cấu hình session cho passport (phải đặt trước routes)
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());

// ==============================
// ROUTES
// ==============================
app.get("/", (req, res) => {
  res.json({
    message: "✅ Server connected with PostgreSQL via Sequelize!",
    timestamp: new Date()
  });
});

import api from "./routes/api.js";
app.use("/api", api);

// ← THÊM: 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.path
  });
});

// ← THÊM: Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: err.message
  });
});

// ==============================
// DATABASE INIT
// ==============================
async function initDatabase() {
  try {
    console.log("🔄 Connecting to database...");
    await sequelize.authenticate();
    console.log("✅ Database connected!");

    // Sync theo thứ tự: Parent trước, Child sau
    // 1. Base models (không có foreign key)
    console.log("🔄 Syncing User table...");
    await User.sync({ alter: true });
    console.log("✅ User table synced");
    
    console.log("🔄 Syncing Category table...");
    await Category.sync({ alter: true });
    console.log("✅ Category table synced");

    // 2. Models phụ thuộc User
    console.log("🔄 Syncing ShippingAddress table...");
    await ShippingAddress.sync({ alter: true });
    console.log("✅ ShippingAddress table synced");

    console.log("🔄 Syncing Cart table...");
    await Cart.sync({ alter: true });
    console.log("✅ Cart table synced");

    console.log("🔄 Syncing Order table...");
    await Order.sync({ alter: true });
    console.log("✅ Order table synced");

    // 3. Models phụ thuộc Product
    console.log("🔄 Syncing Product table...");
    await Product.sync({ alter: true });
    console.log("✅ Product table synced");

    console.log("🔄 Syncing ProductVariant table...");
    await ProductVariant.sync({ alter: true });
    console.log("✅ ProductVariant table synced");

    console.log("🔄 Syncing Review table...");
    await Review.sync({ alter: true });
    console.log("✅ Review table synced");
    
    // 4. Models phụ thuộc Cart và Order
    console.log("🔄 Syncing CartItem table...");
    await CartItem.sync({ alter: true });
    console.log("✅ CartItem table synced");

    console.log("🔄 Syncing OrderItem table...");
    await OrderItem.sync({ alter: true });
    console.log("✅ OrderItem table synced");

    console.log("🔄 Syncing Payment table...");
    await Payment.sync({ alter: true });
    console.log("✅ Payment table synced");

    // 5. Promotion (nếu có)
    try {
      console.log("🔄 Syncing Promotion table...");
      await Promotion.sync({ alter: true });
      console.log("✅ Promotion table synced");
    } catch (promoError) {
      console.warn("⚠️ Promotion table sync skipped:", promoError.message);
    }

    console.log("✅ All tables synced successfully!");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    console.error("Error details:", error.message);
    console.error("Stack trace:", error.stack);
    process.exit(1); // ← Dừng server nếu DB lỗi
  }
  //wishlist
  await Wishlist.sync({ alter: true }); 
    console.log("✅ Wishlist table ready!");
}

// ==============================
// START SERVER
// ==============================
export const startServer = async () => {
  await initDatabase();
};

export default app;
