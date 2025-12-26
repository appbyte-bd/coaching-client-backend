import express from "express";
const router = express.Router();

import { uploadProductImages } from "../middlewares/upload.middleware.js";
import { authorize } from "../middlewares/auth.middleware.js";

import * as ctr from "../controllers/webSetting.controller.js";
router.get("/setting", ctr.getWebSetting);
router.put("/setting", uploadProductImages(), ctr.updateWebSetting);


export default router;