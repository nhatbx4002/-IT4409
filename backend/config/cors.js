import { APP_CONSTANTS } from "./constants.js";

export const buildCorsOptions = () => {
  const allowedOrigins = Array.from(
    new Set([
      "http://localhost:5173",
      "http://localhost:5174",
      APP_CONSTANTS.frontendUrl,
    ].filter(Boolean))
  );

  return {
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      const isDev = !APP_CONSTANTS.isProduction;
      const isAllowed = allowedOrigins.includes(origin);

      if (isDev || isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 86400,
  };
};
