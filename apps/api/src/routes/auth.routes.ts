import { Router } from "express";
import { registerUser, loginUser, getMe, getAllUsers } from "../controllers/auth.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

// Registration & Login
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes for authenticated users
router.get("/me", verifyToken, getMe);

// Get all users (for advisor list)
router.get("/users", verifyToken, getAllUsers);

export default router;

