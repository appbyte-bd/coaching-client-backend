import express from "express";
const router = express.Router();
import { getStudentDue, getMonthDue } from "../controllers/due.controller.js";


router.get("/:id", getStudentDue);
router.post("/month", getMonthDue);

export default router;