import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";


import connectDB from "./config/db.js";

import webRoutes from "./routes/web.route.js";
import appRoutes from "./routes/app.route.js";



import adminRoutes from "./routes/admin.route.js";
import studentRoutes from "./routes/student.route.js";
import batchRoutes from "./routes/batch.route.js";
import courseRoutes from "./routes/course.route.js";
import paymentRoutes from "./routes/payment.route.js";
import dueRoutes from "./routes/due.route.js";
import subjectRoutes from "./routes/subject.route.js";
import resultRoutes from "./routes/result.router.js";
import transactionRoutes from "./routes/transaction.route.js";
import staticsRoutes from "./routes/statics.route.js";
import smsRoutes from "./routes/sms.route.js";
import bannerRoutes from "./routes/banner.route.js";
import programRoutes from "./routes/program.route.js";
import teacherRoutes from "./routes/teacher.route.js";
import contactRoutes from "./routes/contact.route.js";
import applicationRoutes from "./routes/application.route.js";
import ceoRoutes from "./routes/ceo.route.js";
import webSettingRoutes from "./routes/webSetting.route.js";

import seedRoutes from "./utils/seed.student.js";


dotenv.config();
const PORT = process.env.PORT || 5000;

connectDB();


const app = express();
app.use("/images", express.static("images"));

const corsOptions = {
  origin: true,
  credentials: true,
};
app.use(cookieParser());
app.use(cors(corsOptions));
app.set("trust proxy", true);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));




// app.use((req, res, next) => {
//   const token = req.cookies.token;
//   // console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Token: ${token || 'No token'}`);
//   console.log(`Token: ${token || 'No token'}`);
//   next(); // Important: pass control to next middleware/route
// });

app.get("/", (req, res) => {
  res.send("JP Coaching Backend!");
});

app.use("/web", webRoutes);
app.use("/app", appRoutes);


app.use("/admin", adminRoutes);

import { authenticate } from "./middlewares/auth.middleware.js";
app.use(authenticate);

app.use("/student", studentRoutes);
app.use("/batch", batchRoutes);
app.use("/course", courseRoutes);
app.use("/payment", paymentRoutes);
app.use("/due", dueRoutes);
app.use("/subject", subjectRoutes);
app.use("/result", resultRoutes);
app.use("/transaction", transactionRoutes);
app.use("/statics", staticsRoutes);
app.use("/sms", smsRoutes);
app.use("/banner", bannerRoutes);
app.use("/program", programRoutes);
app.use("/teacher", teacherRoutes);
app.use("/contact", contactRoutes);
app.use("/application", applicationRoutes);
app.use("/ceo", ceoRoutes);
app.use("/seed", seedRoutes);
app.use("/webSetting", webSettingRoutes);


app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});
app.listen(PORT, () => {
  console.log(`Client1 Server is running on port ${PORT}`);
});