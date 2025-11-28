import express from "express";
import * as promotionController from "../controllers/promotionController.js";
import { authenticateToken } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", promotionController.getPromotions);
router.post("/apply", promotionController.applyCoupon);

// Admin Only
router.post("/create", authenticateToken, isAdmin, promotionController.createPromotion);
router.delete("/:id", authenticateToken, isAdmin, promotionController.deletePromotion);

export default router;