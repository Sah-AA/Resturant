import { Router } from "express";
import { getAll, create, update, remove } from "../Controllers/category.controller.js";
import { protect } from "../Middleware/auth.middleware.js";
import { requireRole } from "../Middleware/role.middleware.js";

const router = Router();
router.use(protect);

router.get("/", getAll);
router.post("/", requireRole("admin"), create);
router.put("/:id", requireRole("admin"), update);
router.delete("/:id", requireRole("admin"), remove);

export default router;
