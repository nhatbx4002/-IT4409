// server.js
import { loadEnv } from "./config/env.js";
import app, { startServer } from "./api.js";

console.log("🔄 Loading environment variables...");
loadEnv();
console.log("✅ Environment variables loaded");

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    console.log("🔄 Starting server initialization...");
    await startServer(); // Khởi tạo database
    console.log("🔄 Starting HTTP server...");
    app.listen(PORT, () => {
      console.log(`🚀 Server started on port ${PORT}`);
      console.log(`📍 http://localhost:${PORT}`);
      console.log(`📍 API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();
