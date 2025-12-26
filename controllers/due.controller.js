import Payment from "../models/payment.model.js";
import Student from "../models/student.model.js";
import { ok, fail } from "../utils/response.js"

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export const getMonthName = (monthNumber) => {
    return MONTH_NAMES[monthNumber - 1] || 'Invalid Month';
};


export const getStudentDue = async (req, res) => {
    const { id } = req.params;
    try {
        const student = await Student.findById(id);
        if (!student) {
            return fail(res, 404, "student not found")
        }
        const studentPayments = await Payment.find({
            feeType: "Monthly",
            s_id: student._id
        }).sort({ year: 1, months: 1 });
        if (studentPayments.length === 0) {
            return ok(res, {
                student,
                totalPaid: 0,
                totalDue: 0,
                paidMonths: [],
                unpaidMonths: [],
                partiallyPaidMonths: [],
                message: "No payment records found"
            })
        }

        const firstPayment = studentPayments[0];
        const firstYear = parseInt(firstPayment.year);
        const firstMonth = Math.min(...firstPayment.months);

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        const unpaidMonths = [];
        const partiallyPaidMonths = [];
        const paidMonths = [];
        let totalDue = 0;
        let totalPaid = 0;

        const monthlyFee = parseInt(student.monthlyFee);

        // Loop from firstMonth/firstYear to currentMonth/currentYear
        for (let year = firstYear; year <= currentYear; year++) {
            const startMonth = (year === firstYear) ? firstMonth : 1;
            const endMonth = (year === currentYear) ? currentMonth : 12;

            for (let month = startMonth; month <= endMonth; month++) {
                // Search if this month has payment in studentPayments
                const monthPayments = studentPayments.filter(payment =>
                    parseInt(payment.year) === year && payment.months.includes(month)
                );

                if (monthPayments.length === 0) {
                    const monthName = getMonthName(month)
                    // No payment found for this month
                    unpaidMonths.push({ year, month: monthName, due: monthlyFee });
                    totalDue += monthlyFee;
                } else {
                    // Payment exists, calculate total paid and total amount for this month
                    let monthPaid = 0;
                    let monthDue = 0;

                    monthPayments.forEach(payment => {
                        monthPaid += payment.paid || 0;
                        monthDue += payment.due || 0;
                    });


                    const monthName = getMonthName(month)
                    if (monthDue > 0) {
                        // Has due - partially paid
                        partiallyPaidMonths.push({
                            year,
                            month: monthName,
                            paid: monthPaid,
                            due: monthDue
                        });
                        totalPaid += monthPaid;
                        totalDue += monthDue;
                    } else {
                        // No due - fully paid
                        paidMonths.push({
                            year,
                            month: monthName,
                            paid: monthPaid
                        });
                        totalPaid += monthPaid;
                    }
                }
            }
        }

        return ok(res, {
            student,
            paidMonths,
            partiallyPaidMonths,
            unpaidMonths,
            totalPaid,
            totalDue
        })


    } catch (error) {
        console.error("Error to get student due", error)
        return fail(res, 500, error.message || "Server Error")
    }
}


export const getMonthDue = async (req, res) => {
    const { month, year } = req.body;
    try {
        if (!month || !year) {
            return fail(res, 400, "Month and year are required")
        }
        const monthNum = parseInt(month);
        const yearNum = parseInt(year);

        if (monthNum < 1 || monthNum > 12) {
            return fail(res, 400, "Month must be between 1 and 12")
        }

        const targetDate = new Date(yearNum, monthNum - 1, 1);

        // Find active students admitted BEFORE this date
        const studentsWithOutImageUrls = await Student.find({
            status: "Active",
            createdAt: { $lt: targetDate }
        }).lean();
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const students = studentsWithOutImageUrls.map((student) => {
            if (student.img) {
                return {
                    ...student,
                    img: `${baseUrl}/images/${student.img}`
                }
            }
            return student;
        });

        const payments = await Payment.find({
            feeType: "Monthly",
            months: { $in: [month] },
            year: year
        });

        // 3) Build a Set of paid student IDs
        const paidIds = new Set(
            payments.map((p) => p.s_id.toString())
        );

        // 4) Filter students who are NOT in paidIds
        const paidStudents = students.filter(
            (s) => paidIds.has(s._id.toString())
        );
        const dueStudents = students.filter(
            (s) => !paidIds.has(s._id.toString())
        );

        const paidFeeTotal = paidStudents.reduce((sum, student) => sum + parseInt(student.monthlyFee), 0);
        const dueFeeTotal = dueStudents.reduce((sum, student) => sum + parseInt(student.monthlyFee), 0);


        return res.status(200).json({
            success: true,
            totalPaid: paidFeeTotal,
            totalDue: dueFeeTotal,
            totalPaidCount: paidStudents.length,
            totalDueCount: dueStudents.length,
            paidStudents,
            dueStudents
        });

    } catch (error) {
        return fail(res, 500, error.message || "failed to get this month due")
    }

}