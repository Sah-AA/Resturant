import { Router } from "express";
import { get, update } from "../Controllers/settings.controller.js";
import { protect } from "../Middleware/auth.middleware.js";
import { requireRole } from "../Middleware/role.middleware.js";

const router = Router();
router.use(protect);

router.get("/", get);
router.put("/", requireRole("admin"), update);

export default router;
