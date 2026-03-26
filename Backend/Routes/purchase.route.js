import { Router } from "express";
import { getAll, create, remove } from "../Controllers/purchase.controller.js";
import { protect } from "../Middleware/auth.middleware.js";
import { requireRole } from "../Middleware/role.middleware.js";

const router = Router();
router.use(protect);
router.use(requireRole("admin", "account"));

router.get("/", getAll);
router.post("/", create);
router.delete("/:id", remove);

export default router;
