import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { 
  sequelize,
  User,
  ShippingAddress,
  Category,
  Product,
  Order,
  Payment,
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

    await User.sync({ alter: true });
    console.log("✅ User table ready!");
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