import express from "express"
const router = express.Router();

import * as ctr from "../controllers/statics.controller.js"

router.get("/widgets", ctr.getWidgets);
router.get("/monthly-report", ctr.getMonthlyFinancialData);
router.get("/today-report", ctr.getTodayReport);
router.get("/student-statics", ctr.getStudentReport);
export default router;
