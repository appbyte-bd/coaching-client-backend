import express from "express";
const router = express.Router();

import { uploadProductImages } from "../middlewares/upload.middleware.js";
import { authorize } from "../middlewares/auth.middleware.js";

import * as ctr from "../controllers/program.controller.js";
router.get("/all", ctr.getAllPrograms);
router.get("/:id", ctr.getProgramById);
router.post("/add", uploadProductImages(), ctr.createProgram);
router.put("/update/:id", uploadProductImages(), ctr.updateProgram);
router.delete("/delete/:id", ctr.deleteProgram);

// router.get("/all", authorize('admin'), ctr.getAllPrograms);
// router.post("/add", authorize('admin'), uploadProductImages(), ctr.createProgram);
// router.put("/update/:id", authorize('admin'), uploadProductImages(), ctr.updateProgram);
// router.delete("/delete/:id", authorize('admin'), ctr.deleteProgram);

export default router;