import Result from "../models/result.model.js";
import { sendBulkSms, getBalance } from "../utils/sendsms.js";
import studentModel from "../models/student.model.js";
import { ok, fail } from "../utils/response.js"

export const getUserBalance = async (req, res) => {
    try {
        const response = await getBalance();
        if (response.success) {
            return ok(res, response.data)
        }
        throw new Error(response.error)

    } catch (error) {
        console.error("❌ Error geting balance:", error);
        return fail(res, 500, error.message || "Failed to get balance");
    }
};
export const getResult = async (req, res) => {
    try {
        const { className, date } = req.body;
        if (!className || !date) {
            return fail(res, "Date and Class required");
        }
        const results = await Result.find({ class: className, date })
        return ok(res, results)

    } catch (error) {
        console.error("❌ Error geting result:", error);
        return fail(res, 500, error.message || "Failed to get result");
    }
};


export const sendResultSms = async (req, res) => {
    try {
        const { messages } = req.body;
        if (!Array.isArray(messages) || messages.length === 0) {
            return fail(res, "Invalid messages format");
        }

        const result = await sendBulkSms(messages);
        return ok(res, result);

    } catch (error) {
        console.error("❌ Error sending result sms:", error);
        return fail(res, 500, error.message || "Failed to send result sms");
    }
};


export const sendCustomSms = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return fail(res, "Invalid message format");
        }

        const students = await studentModel.find({ status: "Active" }).select("guardianNumber").lean();

        const messages = students.map(student => ({
            number: student.guardianNumber,
            message: message.trim(),
        }));
        const result = await sendBulkSms(messages);
        return ok(res, result);

    } catch (error) {
        console.error("❌ Error sending custom sms:", error);
        return fail(res, 500, error.message || "Failed to send custom sms");
    }
};

export const sendStudentSms = async (req, res) => {
    try {
        const { messages } = req.body;
        if (!Array.isArray(messages) || messages.length === 0) {
            return fail(res, "Invalid messages format");
        }

        const result = await sendBulkSms(messages);
        return ok(res, result);

    } catch (error) {
        console.error("❌ Error sending student sms:", error);
        return fail(res, 500, error.message || "Failed to send student sms");
    }
};