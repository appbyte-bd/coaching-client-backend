import express from "express";
const router = express.Router();

import * as webController from "../controllers/web.controller.js";

router.post("/admission", webController.createAdmission)
router.post("/contact", webController.createContact)
router.get("/result/toppers", webController.getToppers)
router.get("/result/:studentId", webController.getResults)
router.get("/banner", webController.getBanners)
router.get("/courses", webController.getAllPrograms)
router.get("/teachers", webController.getAllTeachers)
router.get("/ceos", webController.getAllCeo)
router.get("/setting", webController.getWebSetting)


export default router;
