import express from "express";
const router = express.Router();
import * as ctr from "../controllers/result.controller.js";

// Create a new result
router.get("/all", ctr.getResults);
router.get("/:id", ctr.getResultById);
router.post("/add", ctr.createResult);
router.put("/:id", ctr.updateResult);
router.delete("/:id", ctr.deleteResult);
router.get("/student/:id", ctr.getResultsByStudentId);
// router.get("/student/:id", ctr.getStudentResults);


export default router;