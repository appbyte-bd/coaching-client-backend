import Subject from "../models/subject.model.js";
import { ok, fail } from "../utils/response.js"

export const createSubject = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return fail(res, 400, "Subject name required")
        }
        const subject = await Subject.findOne({ name });
        if (subject) {
            return fail(res, 404, "Subject already exists")
        }
        await Subject.create({ name });
        return ok(res, { message: "Subject created successfully" })
    } catch (error) {
        console.error("❌ Error create subject", error);
        return fail(res, 500, error.message)
    }
};

export const getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({}).sort({ _id: -1 });
        return ok(res, subjects)
    } catch (error) {
        console.error("❌ Error get all subjects", error);
        return fail(res, 500, error.message)
    }
}


export const deleteSubject = async (req, res) => {
    try {
        const subject = await Subject.findByIdAndDelete(req.params.id);
        if (!subject) {
            return fail(res, 404, "Subject not found")
        }
        return ok(res, { message: "Subject deleted successfully" })
    } catch (error) {
        console.error("❌ Error delete subject", error);
        return fail(res, 500, error.message)
    }
};