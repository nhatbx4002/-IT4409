import { User } from "../models/index.js";
import { verifyAccessToken } from "../services/authService.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Access denied",
        message: "No token provided",
      });
    }

    const decoded = verifyAccessToken(token);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid token",
        message: "User not found",
      });
    }

    const currentVersion = user.token_version || 0;
    if (decoded.version !== currentVersion) {
      return res.status(401).json({
        success: false,
        error: "Invalid token",
        message: "Token has been revoked",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: "Invalid token",
        message: "Token is malformed",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Token expired",
        message: "Please login again",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Authentication failed",
      message: error.message,
    });
  }
};
