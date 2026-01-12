import express from "express";
const router = express.Router();

import * as appController from "../controllers/app.controller.js";

router.post("/login", appController.login);
router.get("/banners", appController.getBanners);
router.get("/setting", appController.getAppSetting);

export default router;
