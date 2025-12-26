import express from "express";
const router = express.Router();

import { createBatch, getBatches, getBatchById, updateBatch, deleteBatch } from "../controllers/batch.controller.js";

router.post("/add", createBatch);
router.get("/all", getBatches);
router.get("/:id", getBatchById);
router.put("/:id", updateBatch);
router.delete("/:id", deleteBatch);

export default router;
