import ExpenceCategory from "../models/expenceCategory.model.js";
import { ok, fail } from "../utils/response.js"

export const createExpenceCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return fail(res, 400, "Expence category name required")
        }
        const expenceCategory = await ExpenceCategory.findOne({ name });
        if (expenceCategory) {
            return fail(res, 404, "Expence category already exists")
        }
        await ExpenceCategory.create({ name });
        return ok(res, { message: "Expence category created successfully" })
    } catch (error) {
        console.error("❌ Error create expence category", error);
        return fail(res, 500, error.message)
    }
};

export const getAllExpenceCategories = async (req, res) => {
    try {
        const expenceCategories = await ExpenceCategory.find({}).sort({ _id: -1 });
        return ok(res, expenceCategories)
    } catch (error) {
        console.error("❌ Error get all expence categories", error);
        return fail(res, 500, error.message)
    }
}


export const deleteExpenceCategory = async (req, res) => {
    try {
        const expenceCategory = await ExpenceCategory.findByIdAndDelete(req.params.id);
        if (!expenceCategory) {
            return fail(res, 404, "Expence category not found")
        }
        return ok(res, { message: "Expence category deleted successfully" })
    } catch (error) {
        console.error("❌ Error delete expence category", error);
        return fail(res, 500, error.message)
    }
};