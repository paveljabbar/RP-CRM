import { Router } from "express";
import { registerUser, loginUser, getMe } from "../controllers/auth.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { getAllUsers } from "../controllers/auth.controller";

const router = Router();

// 🟢 Registrierung & Login
router.post("/register", registerUser);
router.post("/login", loginUser);

// 🟢 Geschützte Route für eingeloggte Benutzer
router.get("/me", verifyToken, getMe);

// 🟢 Alle Benutzer abrufen (Beraterliste)
router.get("/users", verifyToken, getAllUsers);



export default router;

