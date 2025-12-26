import express from "express";
const router = express.Router();

import { getAllApplication, deleteApplication } from "../controllers/application.controller.js";

router.get("/all", getAllApplication);
router.delete("/:id", deleteApplication);

export default router;
