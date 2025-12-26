import express from "express";
const router = express.Router();

import { uploadProductImages } from "../middlewares/upload.middleware.js";
import { authorize } from "../middlewares/auth.middleware.js";

import { createStudent, getAllStudents, getActiveStudents, getInactiveStudents, getAllClassStudents, discountedStudents, getStudentById, idExist, updateStudent, updateCourseStudent, deleteStudent, getAllBatchStudents, getAllCourseStudents, verifyStudent, cancelDiscount, getStudentForAdmission } from "../controllers/student.controller.js";

router.get("/all", getAllStudents);
router.get("/batch", getAllBatchStudents);
router.get("/course", getAllCourseStudents);
router.get("/active", getActiveStudents);
router.get("/inactive", getInactiveStudents);
router.get("/discount", discountedStudents);
router.get("/class/:class", getAllClassStudents);
router.get("/admission/:id", getStudentForAdmission);
router.get("/:id", getStudentById);


router.post("/idExist", idExist);
router.post("/add", uploadProductImages(), createStudent);
router.post("/verify/:id", verifyStudent);
router.post("/discount/cancel/:id", cancelDiscount);


router.put("/:id", uploadProductImages(), updateStudent);
router.put("/course/:id", uploadProductImages(), updateCourseStudent);
router.delete("/delete/:id", authorize('admin'), deleteStudent);

export default router;
