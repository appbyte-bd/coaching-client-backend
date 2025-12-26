import Result from "../models/result.model.js";
import { ok, fail } from "../utils/response.js";

// Get all results
export const getResults = async (req, res) => {
    try {
        const results = await Result.find().sort({ createdAt: -1 }).select('-students');
        return ok(res, results);
    } catch (error) {
        console.error("❌ Error get results", error);
        return fail(res, 500, error.message)
    }
}

// Get a result by ID
export const getResultById = async (req, res) => {
    try {
        const result = await Result.findById(req.params.id);
        if (!result) {
            return fail(res, 404, "Result not found");
        }
        return ok(res, result);
    } catch (error) {
        console.error("❌ Error get result by id", error);
        return fail(res, 500, error.message)
    }
}

// Create a new result
export const createResult = async (req, res) => {
    try {
        const result = await Result.create(req.body);
        return ok(res, result);
    } catch (error) {
        console.error("❌ Error create result", error);
        return fail(res, 500, error.message)
    }
}

// Update a result by ID
export const updateResult = async (req, res) => {
    try {
        const result = await Result.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!result) {
            return fail(res, 404, "Result not found");
        }
        return ok(res, result);
    } catch (error) {
        console.error("❌ Error update result", error);
        return fail(res, 500, error.message)
    }
}

// Delete a result by ID
export const deleteResult = async (req, res) => {
    try {
        const result = await Result.findByIdAndDelete(req.params.id);
        if (!result) {
            return fail(res, 404, "Result not found");
        }
        return ok(res, { message: "Result deleted successfully" });
    } catch (error) {
        console.error("❌ Error delete result", error);
        return fail(res, 500, error.message)
    }
}

// Get results by student _id
export const getResultsByStudentId = async (req, res) => {
    try {
        const studentId = req.params.id;
        const results = await Result.find({ 'students.id': studentId }).sort({ date: -1 });
        return ok(res, results);
    } catch (error) {
        console.error("❌ Error get results by student id", error);
        return fail(res, 500, error.message)
    }
}