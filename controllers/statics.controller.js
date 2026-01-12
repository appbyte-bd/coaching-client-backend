import Student from "../models/student.model.js"
import Batch from "../models/batch.model.js"
import Course from "../models/course.model.js"
import Payment from "../models/payment.model.js"
import Transaction from "../models/transaction.model.js"
import { ok, fail } from "../utils/response.js"

export const getWidgets = async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments()
        const totalBatch = await Batch.countDocuments()
        const totalCourse = await Course.countDocuments()

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear().toString();

        const paymests = await Payment.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startOfMonth,
                        $lt: startOfNextMonth
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalPaid: { $sum: "$paid" },
                    totalTransactions: { $sum: 1 }
                }
            }
        ]);

        const paidStudentIds = await Payment.distinct("s_id", {
            feeType: "Monthly",
            months: { $in: [currentMonth] },
            year: currentYear
        });

        const result = await Student.aggregate([
            {
                $match: {
                    status: "Active",
                    createdAt: { $lt: startOfMonth },
                    _id: { $nin: paidStudentIds }
                }
            },
            {
                $group: {
                    _id: null,
                    totalDue: { $sum: { $toInt: "$monthlyFee" } }
                }
            }
        ]);

        const expences = await Transaction.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startOfMonth,
                        $lt: startOfNextMonth
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalPaid: { $sum: "$amount" },
                    totalTransactions: { $sum: 1 }
                }
            }
        ]);

        const currentMonthPayment = paymests.length > 0 ? paymests[0]?.totalPaid : 0;
        const currentMonthDue = result.length > 0 ? result[0]?.totalDu : 0
        const currentMonthExpence = expences.length > 0 ? expences[0]?.totalPaid : 0

        return ok(res, {
            totalStudents,
            totalBatch,
            totalCourse,
            currentMonthDue,
            currentMonthPayment,
            currentMonthExpence
        })
    } catch (error) {
        console.error("Error to get widgets due", error)
        return fail(res, 400, error.messae || "Error to get widgets due")
    }
}



export const getMonthlyFinancialData = async (req, res) => {
    try {
        // Get year from query params or use current year
        const year = parseInt(req.query.year) || new Date().getFullYear();

        // Define year boundaries
        const startOfYear = new Date(year, 0, 1);      // Jan 1st
        const endOfYear = new Date(year + 1, 0, 1);    // Jan 1st next year

        // Aggregate INCOME from Payment collection
        const incomeData = await Payment.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startOfYear,
                        $lt: endOfYear
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    totalIncome: { $sum: "$paid" }
                }
            }
        ]);

        // Aggregate EXPENSE from Transaction collection
        const expenseData = await Transaction.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startOfYear,
                        $lt: endOfYear
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    totalExpense: { $sum: "$amount" }
                }
            }
        ]);

        // Month names array
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        // Create lookup maps for O(1) access
        const incomeMap = new Map(
            incomeData.map(item => [item._id, item.totalIncome])
        );
        const expenseMap = new Map(
            expenseData.map(item => [item._id, item.totalExpense])
        );

        // Build result for all 12 months
        const monthlyData = monthNames.map((month, index) => {
            const monthNumber = index + 1;
            const income = incomeMap.get(monthNumber) || 0;
            const expense = expenseMap.get(monthNumber) || 0;
            const profit = income - expense;

            return {
                month,
                income,
                expense,
                profit
            };
        });

        // Calculate yearly totals
        const yearlyTotals = monthlyData.reduce(
            (acc, curr) => ({
                totalIncome: acc.totalIncome + curr.income,
                totalExpense: acc.totalExpense + curr.expense,
                totalProfit: acc.totalProfit + curr.profit
            }),
            { totalIncome: 0, totalExpense: 0, totalProfit: 0 }
        );

        return res.status(200).json({
            success: true,
            year,
            data: monthlyData,
            summary: yearlyTotals
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to get financial data"
        });
    }
};


export const getTodayReport = async (req, res) => {
    try {
        const now = new Date();
        
        // Start of today (00:00:00.000)
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        // Start of tomorrow (00:00:00.000)
        const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

        // Run both queries in parallel for better performance
        const [incomeResult, expenseResult] = await Promise.all([
            // Today's Income from Payment
            Payment.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: startOfToday,
                            $lt: startOfTomorrow
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalIncome: { $sum: "$paid" },
                        count: { $sum: 1 }
                    }
                }
            ]),
            // Today's Expense from Transaction
            Transaction.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: startOfToday,
                            $lt: startOfTomorrow
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalExpense: { $sum: "$amount" },
                        count: { $sum: 1 }
                    }
                }
            ])
        ]);

        const income = incomeResult[0]?.totalIncome || 0;
        const expense = expenseResult[0]?.totalExpense || 0;
        const profit = income - expense;

        return res.status(200).json({
            success: true,
            date: startOfToday.toISOString().split('T')[0], // "2025-01-15"
            income,
            expense,
            profit
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to get today's report"
        });
    }
};


export const getStudentReport = async (req, res) => {
    try {
        const result = await Student.aggregate([
            {
                $match: { status: "Active" } // Only count active students
            },
            {
                $facet: {
                    // Count by Class
                    byClass: [
                        {
                            $group: {
                                _id: "$className",
                                count: { $sum: 1 }
                            }
                        },
                        { $sort: { _id: 1 } }
                    ],
                    
                    // Count by Batch (include className)
                    byBatch: [
                        {
                            $match: { 
                                batch: { $exists: true, $ne: null, $ne: "" } 
                            }
                        },
                        {
                            $group: {
                                _id: "$batch",
                                className: { $first: "$className" },
                                count: { $sum: 1 }
                            }
                        },
                        { $sort: { _id: 1 } }
                    ],
                    
                    // Count by Course (include className)
                    byCourse: [
                        {
                            $match: { 
                                course: { $exists: true, $ne: null, $ne: "" } 
                            }
                        },
                        {
                            $group: {
                                _id: "$course",
                                className: { $first: "$className" },
                                count: { $sum: 1 }
                            }
                        },
                        { $sort: { _id: 1 } }
                    ],
                    
                    // Total count
                    total: [
                        { $count: "count" }
                    ]
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                byClass: result[0].byClass,
                byBatch: result[0].byBatch,
                byCourse: result[0].byCourse,
                totalStudents: result[0].total[0]?.count || 0
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching student counts",
            error: error.message
        });
    }
};