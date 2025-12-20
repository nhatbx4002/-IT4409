import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/authMiddleware.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryBySlug,
  updateCategory,
} from "../controllers/categoryController.js";

const router = Router();

// Public category endpoints
router.get("/categories", getCategories);
router.get("/categories/:slug", getCategoryBySlug);

// Admin category management
router.post("/admin/categories", authenticateToken, isAdmin, createCategory);
router.put("/admin/categories/:id", authenticateToken, isAdmin, updateCategory);
router.delete("/admin/categories/:id", authenticateToken, isAdmin, deleteCategory);

export default router;
