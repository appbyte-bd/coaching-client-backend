import express from "express"
const router = express.Router();

import * as ctr from "../controllers/transaction.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

router.post("/add", ctr.createTransaction);
router.post("/all", ctr.getAllTransactions);
router.post("/expence", ctr.getAllExpence);
router.delete("/:id", authorize("admin"), ctr.deleteTransaction);

export default router;