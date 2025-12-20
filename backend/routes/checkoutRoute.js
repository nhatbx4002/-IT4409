import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.js";
import { validateCheckoutController } from "../controllers/checkoutController.js";

const router = Router();

router.post("/validate", validateCheckoutController);

export default router;
