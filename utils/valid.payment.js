import mongoose from "mongoose";

export const validatePayment = (payment) => {
    const { s_id, studentId, feeType, months, year, totalAmount, paid, discount, note } = payment;

    if (!s_id || !studentId || !feeType || !totalAmount || !paid) {
        return false;
    }

    if (typeof s_id !== 'string' || !mongoose.Types.ObjectId.isValid(s_id) || !/^[0-9a-fA-F]{24}$/.test(s_id)) {
        return false;
    }

    if (feeType === "Monthly") {
        if (!months?.length || !year) {
            return false;
        }
        if (!months.every(month =>
            typeof month === 'number' &&
            Number.isInteger(month) &&
            month >= 1 &&
            month <= 12
        )) {
            return false;
        }
    }

    if (discount && !note) {
        return false;
    }

    return true;
}

