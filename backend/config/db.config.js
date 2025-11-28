import { Sequelize } from "sequelize";
import { loadEnv } from "./env.js";

const env = loadEnv();
const sslEnabled = env.DB_SSL === "true";

export const sequelize = new Sequelize(
  env.DB_NAME,
  env.DB_USER,
  env.DB_PASSWORD,
  {
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: "postgres",
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000, // 30 seconds timeout để acquire connection
      idle: 10000, // 10 seconds idle timeout
    },
    dialectOptions: {
      ...(sslEnabled && {
        ssl: {
          require: true,
          rejectUnauthorized: false, // bắt buộc với Supabase
        },
      }),
      connectTimeout: 30000, // 30 seconds connection timeout
    },
  }
);
