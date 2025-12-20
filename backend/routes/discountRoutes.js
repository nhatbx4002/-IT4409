import express from "express";
import discountController from "../controllers/discountController.js";

const router = express.Router();

// Public endpoints - no authentication required
router.get("/active", discountController.getActive);
router.get("/validate/:code", discountController.validateCode);
router.post("/apply", discountController.apply);

// Admin endpoints - authentication and admin access handled by parent router in admin/index.js
router.get("/", discountController.listDiscounts);
router.post("/", discountController.createDiscount);
router.put("/:id", discountController.updateDiscount);
router.delete("/:id", discountController.deleteDiscount);

export default router;
