import { Router } from "express";
import { getAll, create, settle, remove } from "../Controllers/credit.controller.js";
import { protect } from "../Middleware/auth.middleware.js";

const router = Router();
router.use(protect);

router.get("/", getAll);
router.post("/", create);
router.patch("/:id/settle", settle);
router.delete("/:id", remove);

export default router;
