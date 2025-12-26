import express from "express";
const router = express.Router();

import { createCourse, getCourses, getCourseById, updateCourse, deleteCourse } from "../controllers/course.controller.js";

router.post("/add", createCourse);
router.get("/all", getCourses);
router.get("/:id", getCourseById);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

export default router;
