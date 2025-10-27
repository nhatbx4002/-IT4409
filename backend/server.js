// server.js
import dotenv from "dotenv";
import app, { startServer } from "./api.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

(async () => {
  await startServer(); // Khởi tạo database
  app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
  });
})();