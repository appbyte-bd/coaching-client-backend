import express from "express";
const router = express.Router();
import { getAllPayments, unVerifiedPayments, verifyPayment, cancelPaymentDiscount, createPayment, getPaymentshistory, getPaymentsById, deletePaymentById, getCoursePaymentshistory } from "../controllers/payment.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";


router.post("/all", getAllPayments);
router.get("/unVerified", unVerifiedPayments);
router.post("/verify/:id", verifyPayment);
router.post("/discount/cancel/:id", cancelPaymentDiscount);
router.post("/add", createPayment);
router.get("/:id", getPaymentsById);
router.get("/student/:id", getPaymentshistory);
router.get("/student/course/:id", getCoursePaymentshistory);
router.delete("/:id", authorize("admin"), deletePaymentById);
export default router;