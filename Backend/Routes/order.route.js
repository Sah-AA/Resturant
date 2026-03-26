import { Router } from "express";
import { getAll, getById, create, update, closeOrder, cancelOrder } from "../Controllers/order.controller.js";
import { protect } from "../Middleware/auth.middleware.js";
import { requireRole } from "../Middleware/role.middleware.js";

const router = Router();
router.use(protect);

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", create);
router.put("/:id", update);
router.patch("/:id/close", closeOrder);
router.patch("/:id/cancel", requireRole("admin"), cancelOrder);

export default router;
