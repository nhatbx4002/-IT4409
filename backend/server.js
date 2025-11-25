// server.js
import { loadEnv } from "./config/env.js";
import app, { startServer } from "./api.js";

loadEnv();

const PORT = process.env.PORT || 3000;

(async () => {
  await startServer(); // Khởi tạo database
  app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
  });
})();
