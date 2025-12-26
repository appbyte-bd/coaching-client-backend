import express from "express";
import * as ctr from "../controllers/subject.controller.js";
const router = express.Router();

router.post("/add", ctr.createSubject);
router.get("/all", ctr.getAllSubjects);
router.delete("/:id", ctr.deleteSubject);

export default router;