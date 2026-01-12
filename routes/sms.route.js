import express from "express"
const router = express.Router();

import * as ctr from "../controllers/sms.controller.js"

router.get("/balance", ctr.getUserBalance);
router.post("/result", ctr.getResult);
router.post("/send/result", ctr.sendResultSms);
router.post("/send/custom", ctr.sendCustomSms);
router.post("/send/student", ctr.sendStudentSms);


export default router;
