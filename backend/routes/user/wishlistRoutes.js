import express from "express";
import * as wishlistController from "../../controllers/user/wishlistController.js";

const router = express.Router();

router.post("/add", wishlistController.addToWishlist);
router.get("/:userId", wishlistController.getWishlistByUser);
router.delete("/remove", wishlistController.removeFromWishlist);

export default router;