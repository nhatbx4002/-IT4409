import express from "express";
import * as userController from "../../controllers/admin/userController.js";
import { authenticateToken } from "../../middlewares/auth.js";
import { isAdmin } from "../../middlewares/authMiddleware.js"; 

const router = express.Router();

// BẢO VỆ TOÀN BỘ ROUTE: Phải đăng nhập + Phải là Admin
router.use(authenticateToken, isAdmin);

router.get("/", userController.getUsers);              // Xem danh sách
router.patch("/:id/lock", userController.toggleLock);  // Khóa/Mở
router.patch("/:id/role", userController.setRole);     // Phân quyền
router.delete("/:id", userController.deleteUser);      // Xóa

export default router;