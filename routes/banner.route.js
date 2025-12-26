import express from "express";
const router = express.Router();

import { uploadProductImages } from "../middlewares/upload.middleware.js";
import { createBanner, getBanners, deleteBanner } from "../controllers/banner.controller.js";

router.post("/add", uploadProductImages(), createBanner);
router.get("/all", getBanners);
router.delete("/:id", deleteBanner);



export default router;