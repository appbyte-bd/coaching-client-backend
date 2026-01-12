import TransactionModel from "../models/transaction.model.js";
import PaymentModel from "../models/payment.model.js";
import { ok, fail } from "../utils/response.js"

export const createTransaction = async (req, res) => {
    try {
        const { category, amount, note, date } = req.body;
        if (!category || !amount) {
            return fail(res, "Category, amount are required");
        }
        await TransactionModel.create({
            title: category,
            amount,
            note,
            date
        });

        return ok(res, { message: "Transaction created successfully" });
    } catch (error) {
        console.error("❌ Error creating transaction:", error);
        return fail(res, 500, error.message || "Failed to create transaction");
    }
};


// Helper function to convert DD/MM/YYYY to YYYY-MM-DD for comparison
const convertToComparable = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
};

export const getAllTransactions = async (req, res) => {
    try {
        const { from, to } = req.body;

        const now = new Date();
        const pad = (n) => String(n).padStart(2, '0');

        // Default dates (current month)
        const monthStart = `01/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const monthEnd = `${pad(lastDay)}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;

        // Determine date range
        const fromDate = from || monthStart;
        const toDate = to || monthEnd;

        // For Transaction (string comparison)
        const fromComp = convertToComparable(fromDate);
        const toComp = convertToComparable(toDate);

        // For Payment (Date objects)
        const [fd, fm, fy] = fromDate.split('/').map(Number);
        const [td, tm, ty] = toDate.split('/').map(Number);
        const startDate = new Date(fy, fm - 1, fd, 0, 0, 0);
        const endDate = new Date(ty, tm - 1, td, 23, 59, 59);

        // Get expenses (only title, date, amount)
        const allExpenses = await TransactionModel.find();
        const expenses = allExpenses.filter(e => {
            const d = convertToComparable(e.date);
            return d >= fromComp && d <= toComp;
        });

        // Get payments and format as incomes
        const payments = await PaymentModel.find({
            createdAt: { $gte: startDate, $lte: endDate }
        }).populate('s_id');

        const incomes = payments.map(p => {
            const d = new Date(p.createdAt);
            return {
                name: p.s_id?.name,
                id: p.s_id?.id,
                className: p.s_id?.className,
                batch: p.s_id?.batch || p.s_id?.course,
                feeType: p.feeType,
                date: `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`,
                amount: p.paid,
                recievedBy: p.recievedBy,
            };
        });

        // Calculate totals
        const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
        const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);

        res.status(200).json({
            expenses,
            incomes,
            totalExpense,
            totalIncome
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



const isValidDate = (dateStr) => {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return false;

    const [day, month, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);

    return date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day;
};


export const getAllExpence = async (req, res) => {
    try {
        const { from, to, category, page = 1, limit = 20 } = req.body;


        // Validate pagination parameters
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        if (pageNum < 1 || limitNum < 1) {
            return res.status(400).json({
                message: "Page and limit must be positive numbers"
            });
        }

        // Build query object
        let query = {};
        if (category && category.trim()) {
            query.title = { $regex: category.trim(), $options: 'i' };
        }

        // If date range is provided, add date filter
        if (from || to) {
            // Validate date formats
            if (from && !isValidDate(from)) {
                return res.status(400).json({
                    message: "Invalid 'from' date format. Use DD/MM/YYYY"
                });
            }
            if (to && !isValidDate(to)) {
                return res.status(400).json({
                    message: "Invalid 'to' date format. Use DD/MM/YYYY"
                });
            }



            // Convert dates for comparison
            const fromComparable = from ? convertToComparable(from) : null;
            const toComparable = to ? convertToComparable(to) : null;

            // Validate date range logic
            if (fromComparable && toComparable && fromComparable > toComparable) {
                return res.status(400).json({
                    message: "'from' date cannot be after 'to' date"
                });
            }

            // Get all transactions and filter by date range
            const allTransactions = await TransactionModel.find(query);

            const filteredIds = allTransactions
                .filter(transaction => {
                    const transactionComparable = convertToComparable(transaction.date);

                    if (fromComparable && toComparable) {
                        return transactionComparable >= fromComparable &&
                            transactionComparable <= toComparable;
                    } else if (fromComparable) {
                        return transactionComparable >= fromComparable;
                    } else if (toComparable) {
                        return transactionComparable <= toComparable;
                    }
                    return true;
                })
                .map(t => t._id);

            query._id = { $in: filteredIds };
        }

        // Calculate pagination
        const skip = (pageNum - 1) * limitNum;

        // Get total count for pagination
        const totalItems = await TransactionModel.countDocuments(query);

        // Get paginated transactions
        const transactions = await TransactionModel.find(query)
            .sort({ _id: -1 }) // Sort by date descending, then by creation time
            .skip(skip)
            .limit(limitNum);

        // Calculate total pages
        const totalPages = Math.ceil(totalItems / limitNum);

        // Calculate totals for income and expense
        const allFilteredTransactions = await TransactionModel.find(query);

        const totalExpense = allFilteredTransactions.reduce((sum, t) => sum + t.amount, 0);

        // Send response
        res.status(200).json({
            data: transactions,
            totalItems,
            totalPages,
            currentPage: pageNum,
            totalExpense
        });

    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({
            message: "Error fetching transactions",
            error: error.message
        });
    }
};



export const deleteTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTransaction = await TransactionModel.findByIdAndDelete(id);
        if (!deletedTransaction) {
            return fail(res, 404, "Transaction not found");
        }
        return ok(res, "Transaction deleted successfully", deletedTransaction);
    } catch (error) {
        console.error("❌ Error deleting transaction:", error);
        return fail(res, 500, error.message || "Failed to delete transaction");
    }
};