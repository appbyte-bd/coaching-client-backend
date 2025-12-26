import Result from "../models/result.model.js";
import { ok, fail } from "../utils/response.js"

export const getResult = async (req, res) => {
    console.log(req.body);

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