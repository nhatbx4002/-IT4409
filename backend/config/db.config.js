import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000, // 30 seconds timeout để acquire connection
      idle: 10000, // 10 seconds idle timeout
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // bắt buộc với Supabase
      },
      connectTimeout: 30000, // 30 seconds connection timeout
    },
  }
);



