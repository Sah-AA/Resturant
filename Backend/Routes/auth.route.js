import { Router } from "express";
import { register, login, logout, getSession } from "../Controllers/auth.controller.js";
import { protect } from "../Middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/session", protect, getSession);

export default router;
