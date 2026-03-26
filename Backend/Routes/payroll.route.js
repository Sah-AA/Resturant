import { Router } from "express";
import { getAll, create, markPaid, remove } from "../Controllers/payroll.controller.js";
import { protect } from "../Middleware/auth.middleware.js";
import { requireRole } from "../Middleware/role.middleware.js";

const router = Router();
router.use(protect);
router.use(requireRole("admin"));

router.get("/", getAll);
router.post("/", create);
router.patch("/:id/paid", markPaid);
router.delete("/:id", remove);

export default router;
