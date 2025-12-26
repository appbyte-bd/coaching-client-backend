import Payment from "../models/payment.model.js";
import Student from "../models/student.model.js";
import Batch from "../models/batch.model.js";
import Course from "../models/course.model.js";
import Result from "../models/result.model.js";
import mongoose from "mongoose";
import { validatePayment } from "../utils/valid.payment.js";
import { ok, fail } from "../utils/response.js"

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export const getMonthName = (monthNumber) => {
    return MONTH_NAMES[monthNumber - 1] || 'Invalid Month';
};

export const getMonthNames = (monthNumbers) => {
    return monthNumbers.map(num => getMonthName(num));
};


export const formatMonthList = (monthNumbers, year) => {
    const names = getMonthNames(monthNumbers);

    if (names.length === 1) {
        return `${names[0]} ${year}`;
    }

    if (names.length === 2) {
        return `${names[0]} and ${names[1]} ${year}`;
    }

    // More than 2 months
    const lastMonth = names.pop();
    return `${names.join(', ')}, and ${lastMonth} ${year}`;
};

export const createPayment = async (req, res) => {
    try {
        const paymentData = req.body;
        if (!validatePayment(paymentData)) {
            return fail(res, 400, "Invalid payment data");
        }

        const { s_id, studentId, feeType } = paymentData;
        const student = await Student.findOne({ id: studentId });
        if (!student) {
            return fail(res, 404, "Student not found");
        }



        if (feeType === "Monthly") {
            // check student is batch student or not
            if (!student.batch) {
                return fail(res, 400, "please take course fee of this student");
            }

            //check student already paid those month
            const existingPayments = await Payment.find({ s_id, feeType: feeType, months: { $in: paymentData.months }, year: req.body.year });

            if (existingPayments.length > 0) {
                const alreadyPaidMonths = existingPayments.flatMap(p => p.months);
                const duplicateMonths = paymentData.months.filter(m => alreadyPaidMonths.includes(m));
                const formattedMonths = formatMonthList(duplicateMonths, paymentData.year);

                return fail(res, 400, `Student has already paid for ${formattedMonths}`)
            }

            // validate amount
            const requiredAmount = student.monthlyFee * paymentData.months?.length;
            const paid = parseInt(paymentData.paid) || 0;
            const discount = parseInt(paymentData.discount) || 0;
            const due = parseInt(paymentData.due) || 0;
            if (paid + discount + due !== requiredAmount) {
                return fail(res, 400, `Payment amounts do not match. Expected total: ${requiredAmount}, but got: ${paid + discount + due}`);
            }
            paymentData.discount = discount;
            paymentData.due = due;

            if (parseInt(paymentData?.discount) > 0 &&  req.admin?.type !== "admin" ) {
                paymentData.isVerified = false
            }
            paymentData.recievedBy = req.admin?.name || "admin"

            const payment = await Payment.create(paymentData);
            return ok(res, { payment, message: "Monthly Payment Added Successfully" });

        } else if (feeType === "Admission") {
            const existingPayment = await Payment.findOne({ s_id, feeType: feeType });
            if (existingPayment) {
                return fail(res, 400, `this student already paid admisson payment on ${new Date(existingPayment.createdAt).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })} `);
            }
            if (student?.batch && student?.batchId) {
                const batch = await Batch.findById(student.batchId)
                if (!batch) {
                    return fail(res, 400, "batch not found");
                }
                console.log(student?.batch, batch);

                const requiredAmount = Number(batch.admissionFee);
                const paid = Number(paymentData.paid) || 0;
                const discount = Number(paymentData.discount) || 0;
                const due = Number(paymentData.due) || 0;
                if (paid + discount + due !== requiredAmount) {
                    return fail(res, 400, `Payment amounts do not match. Expected total: ${requiredAmount}, but got: ${paid + discount + due}`);
                }
                paymentData.discount = discount;
                paymentData.due = due;

                if (Number(paymentData?.discount) > 0 &&  req.admin?.type !== "admin") {
                    paymentData.isVerified = false
                }
                paymentData.recievedBy = req.admin?.name || "admin"

                const payment = new Payment(paymentData);
                await payment.save();
                return ok(res, { message: "Admission Payment Added Successfully" });
            } else {
                const course = await Course.findById(student.courseId)
                if (!course) {
                    return fail(res, 400, "course not found");
                }
                const requiredAmount = Number(course.admissionFee);
                const paid = Number(paymentData.paid) || 0;
                const discount = Number(paymentData.discount) || 0;
                const due = Number(paymentData.due) || 0;

                if (paid + discount + due !== requiredAmount) {
                    return fail(res, 400, `Payment amounts do not match. Expected total: ${requiredAmount}, but got: ${paid + discount + due}`);
                }
                paymentData.discount = discount;
                paymentData.due = due;

                if (Number(paymentData?.discount) > 0 &&  req.admin?.type !== "admin") {
                    paymentData.isVerified = false
                }
                paymentData.recievedBy = req.admin?.name || "admin"
                console.log(paymentData);

                const payment = new Payment(paymentData);
                await payment.save();
                return ok(res, { message: "Admission Payment Added Successfully" });
            }
        } else {
            if (!student.course) {
                return fail(res, 400, "please select batch or course");
            }
            const course = await Course.findById(student.courseId)
            if (!course) {
                return fail(res, 400, "course not found");
            }
            const paid = Number(paymentData.paid) || 0;
            const discount = Number(paymentData.discount) || 0;
            const due = Number(paymentData.due) || 0;

            paymentData.paid = paid;
            paymentData.discount = discount;
            paymentData.due = due;

            if (Number(paymentData?.discount) > 0 &&  req.admin?.type !== "admin") {
                paymentData.isVerified = false
            }
            paymentData.recievedBy = req.admin?.name || "admin"

            const payment = new Payment(paymentData);
            await payment.save();
            return ok(res, { message: "Payment Added Successfully" });
        }


        // const payment = await Payment.create({
        //     s_id: id,
        //     studentId: student.id,
        //     feeType: req.body.feeType,
        //     month: req.body.month,
        //     year: req.body.year,
        //     totalAmount: req.body.totalAmount,
        //     paid: req.body.paid,
        //     discount: req.body.discount,
        //     due: req.body.due,
        //     recievedBy: req.body.recievedBy || "Admin",
        //     note: req.body.note,
        // });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

export const getAllPayments = async (req, res) => {
    const { page = 1, limit = 20, query = "" } = req.body;
    const escapeRegex = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    try {
        // Validate and parse pagination parameters
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Max 100 items per page
        const skip = (pageNum - 1) * limitNum;

        // Build search filter
        let filter = {};

        if (query && query.trim() !== "") {
            const searchQuery = escapeRegex(query.trim());

            const orConditions = [
                { "studentId": { $regex: searchQuery, $options: "i" } },
                { "feeType": { $regex: searchQuery, $options: "i" } },
                { "recievedBy": { $regex: searchQuery, $options: "i" } }
            ];

            // If query is numeric, search in price and totalAmount fields
            if (!isNaN(searchQuery) && searchQuery !== "") {
                const numericQuery = parseFloat(searchQuery);
                orConditions.push(
                    { paid: numericQuery },
                    { discount: numericQuery },
                    { due: numericQuery }
                );
            }

            filter = { $or: orConditions };
        }

        const payments = await Payment.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .lean();

        // Count total documents matching the filter
        const totalItems = await Payment.countDocuments(filter);
        const totalPages = Math.ceil(totalItems / limitNum);

        res.status(200).json({
            data: payments,
            totalItems,
            totalPages,
            currentPage: pageNum
        });
    } catch (error) {
        console.error("❌ Error fetching orders:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch orders. Please try again later."
        });
    }
};

export const getPaymentshistory = async (req, res) => {
    try {
        const s_id = req.params.id;
        if (typeof s_id !== 'string' || !mongoose.Types.ObjectId.isValid(s_id) || !/^[0-9a-fA-F]{24}$/.test(s_id)) {
            return res.status(500).json({ error: "Invalid Student id" });
        }
        const payment = await Payment.find({ s_id }).sort({ _id: -1 });
        res.status(200).json({
            success: true,
            data: payment
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const getCoursePaymentshistory = async (req, res) => {
    try {
        const s_id = req.params.id;
        if (typeof s_id !== 'string' || !mongoose.Types.ObjectId.isValid(s_id) || !/^[0-9a-fA-F]{24}$/.test(s_id)) {
            return res.status(500).json({ error: "Invalid student id" });
        }
        const payment = await Payment.find({ s_id, feeType: "Course" }).sort({ _id: -1 });
        res.status(200).json({
            success: true,
            data: payment
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const unVerifiedPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ isVerified: false })
            .sort({ createdAt: -1 })

        res.status(200).json({ success: true, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findByIdAndUpdate(id, { isVerified: true, verifiedBy: req.admin?.name || 'bappi' }, { new: true })
        if (!payment) {
            return res.status(404).json({
                success: false,
                error: 'Payment not found'
            });
        }
        return res.status(200).json({ success: true, message: "Payment verified successfully" });
    } catch (error) {
        console.error("❌ Error verify payment", error);
        res.status(500).json({ success: false, error: error.message });
    }
}
export const cancelPaymentDiscount = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findById(id).lean()
        if (!payment) {
            return res.status(404).json({
                success: false,
                error: 'Payment not found'
            });
        }
        await Payment.findByIdAndUpdate(id,
            {
                isVerified: true,
                verifiedBy: req.admin?.name || 'bappi',
                discount: 0,
                due: payment.due + payment.discount
            }, { new: true })
        return res.status(200).json({ success: true, message: "Payment discount cancelled successfully" });
    } catch (error) {
        console.error("❌ Error cencle payment discount", error);
        res.status(500).json({ success: false, error: error.message });
    }
}

export const getPaymentsById = async (req, res) => {
    try {
        const id = req.params.id;
        if (typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id) || !/^[0-9a-fA-F]{24}$/.test(id)) {
            return res.status(500).json({ error: "Invalid payment id" });
        }
        const payment = await Payment.findById(id);
        if (!payment) {
            return res.status(404).json({ error: "Payment not found" });
        }
        const student = await Student.findById(payment.s_id);
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }
        const results = await Result.find({ 'students.studentId': payment.s_id }).sort({ _id: -1 }).lean();

        const processedResults = results.map(result => {
            const sortedStudents = [...result.students].sort(
                (a, b) => b.obtainedMarks - a.obtainedMarks
            );

            const highestMark = sortedStudents[0]?.obtainedMarks || 0;

            const studentIndex = sortedStudents.findIndex(
                s => s.studentId.toString() === payment.s_id.toString()
            );

            const rank = studentIndex + 1;

            const studentData = sortedStudents[studentIndex];
            return {
                subject: result.subject,
                date: result.date,
                totalMarks: result.totalMarks,
                studentResult: {
                    obtainedMarks: studentData.obtainedMarks,
                    highestMark: highestMark,
                    rank: rank
                }
            };
        });


        res.status(200).json({
            success: true,
            payment,
            processedResults,
            student
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const deletePaymentById = async (req, res) => {
    try {
        const id = req.params.id;
        if (typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id) || !/^[0-9a-fA-F]{24}$/.test(id)) {
            return res.status(500).json({ error: "Invalid payment id" });
        }
        const payment = await Payment.findByIdAndDelete(id);
        if (!payment) {
            return res.status(404).json({ error: "Payment not found" });
        }
        res.status(200).json({
            success: true,
            data: payment
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
