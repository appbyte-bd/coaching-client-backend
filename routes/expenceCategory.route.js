import express from "express";
import * as ctr from "../controllers/expenceCategory.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/add", ctr.createExpenceCategory);
router.get("/all", ctr.getAllExpenceCategories);
router.delete("/:id", authorize('admin'), ctr.deleteExpenceCategory);

export default router;