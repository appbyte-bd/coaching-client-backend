import express from "express";
const router = express.Router();

import { uploadProductImages } from "../middlewares/upload.middleware.js";
import { authorize } from "../middlewares/auth.middleware.js";

import * as ctr from "../controllers/ceo.controller.js";
router.get("/all", ctr.getAllCeo);
router.get("/:id", ctr.getCeoById);
router.post("/add", uploadProductImages(), ctr.createCeo);
router.put("/update/:id", uploadProductImages(), ctr.updateCeo);
router.delete("/delete/:id", ctr.deleteCeo);

// router.get("/all", authorize('admin'), ctr.getAllTeachers);
// router.post("/add", authorize('admin'), uploadProductImages(), ctr.createTeacher);
// router.put("/update/:id", authorize('admin'), uploadProductImages(), ctr.updateTeacher);
// router.delete("/delete/:id", authorize('admin'), ctr.deleteTeacher);

export default router;