import { Router } from "express";
import { getSummary } from "../Controllers/dashboard.controller.js";
import { protect } from "../Middleware/auth.middleware.js";

const router = Router();
router.use(protect);

router.get("/summary", getSummary);

export default router;
