import { Router } from "express";
import { getAll, getById, create, update, remove } from "../Controllers/menu.controller.js";
import { protect } from "../Middleware/auth.middleware.js";
import { requireRole } from "../Middleware/role.middleware.js";

const router = Router();
router.use(protect);

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", requireRole("admin"), create);
router.put("/:id", requireRole("admin"), update);
router.delete("/:id", requireRole("admin"), remove);

export default router;
