import express from "express"
const router = express.Router();

import * as ctr from "../controllers/sms.controller.js"

router.post("/result", ctr.getResult);


export default router;
