import express from "express";
import { authenticateToken } from "../middlewares/auth.js";
import {
  listProductReviewsController,
  createReviewController,
} from "../controllers/user/reviewController.js";

const router = express.Router();

router.get("/product/:productId", listProductReviewsController);
router.post("/", authenticateToken, createReviewController);

export default router;
