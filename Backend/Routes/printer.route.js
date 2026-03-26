import { Router } from "express";
import { getAll, create, update, remove } from "../Controllers/printer.controller.js";
import { protect } from "../Middleware/auth.middleware.js";
import { requireRole } from "../Middleware/role.middleware.js";

const router = Router();
router.use(protect);
router.use(requireRole("admin"));

router.get("/", getAll);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
