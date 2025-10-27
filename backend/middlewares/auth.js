import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

// Middleware xác thực JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Access denied",
        message: "No token provided"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tìm user trong database
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid token",
        message: "User not found"
      });
    }

    // Kiểm tra token có khớp với database không
    if (user.access_token !== token) {
      return res.status(401).json({
        success: false,
        error: "Invalid token",
        message: "Token does not match"
      });
    }

    // Set user vào request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: "Invalid token",
        message: "Token is malformed"
      });
    }
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Token expired",
        message: "Please login again"
      });
    }

    return res.status(500).json({
      success: false,
      error: "Authentication failed",
      message: error.message
    });
  }
};

