import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import "./config/google.config.js";
import "./config/facebook.config.js";
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
} from "./models/index.js";

dotenv.config();

const app = express();

// ==============================
// MIDDLEWARE
// ==============================
app.use(cors());
app.use(express.json()); // Parse JSON

// ← THÊM: Log requests để debug
app.use((req, res, next) => {
  console.log(`\n📨 ${req.method} ${req.path}`);
  console.log("Content-Type:", req.headers["content-type"]);
  console.log("Body:", JSON.stringify(req.body, null, 2));
  next();
});

// ← THÊM: Error handler cho JSON parsing
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
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

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
    await sequelize.authenticate();
    console.log("✅ Database connected!");

    // Sync theo thứ tự: Parent trước, Child sau
    // 1. Base models (không có foreign key)
    await User.sync({ alter: true });
    
    await Category.sync({ alter: true });
   

    // 2. Models phụ thuộc User
    await ShippingAddress.sync({ alter: true });
   

    await Cart.sync({ alter: true });
   

    await Order.sync({ alter: true });
   

    // 3. Models phụ thuộc Product
    await Product.sync({ alter: true });
    

    await ProductVariant.sync({ alter: true });
   

    await Review.sync({ alter: true });
    
    // 4. Models phụ thuộc Cart và Order
    await CartItem.sync({ alter: true });
  

    await OrderItem.sync({ alter: true });


    await Payment.sync({ alter: true });

    // 5. Promotion (nếu có)
    try {
      await Promotion.sync({ alter: true });
      console.log("✅ Promotion table synced");
    } catch (promoError) {
      console.warn("⚠️ Promotion table sync skipped:", promoError.message);
    }

    console.log("✅ All tables synced successfully!");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    process.exit(1); // ← Dừng server nếu DB lỗi
  }
}

// ==============================
// START SERVER
// ==============================
export const startServer = async () => {
  await initDatabase();
};

export default app;