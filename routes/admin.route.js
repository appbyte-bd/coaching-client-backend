import express from "express";
const router = express.Router();

import * as adminController from "../controllers/admin.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

router.post("/login", adminController.adminLogin);
router.post("/logout", adminController.adminLogout);
router.get("/validate", authenticate, adminController.authAdmin);


router.post("/add", authenticate, authorize('admin'), adminController.createAdmin);
router.get("/all", authenticate, authorize('admin'), adminController.getAllAdmins);
router.put("/:id", adminController.updateAdmin);
router.delete("/:id", authenticate, authorize('admin'), adminController.deleteAdmin);

export default router;
