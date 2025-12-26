
import admissionModel from "../models/admission.model.js";
import { ok, fail } from "../utils/response.js";


export const getAllApplication = async (req, res) => {
    try {
        const data = await admissionModel.find().sort({ _id: -1 });
        return ok(res, data)
    } catch (error) {
        console.error("❌ Error getting admission data", error);
        return fail(res, 500, error.message || "Something went wrong");
    }
}


export const deleteApplication = async (req, res) => {
    const { id } = req.params;
    try {
        await admissionModel.findByIdAndDelete(id);
        return ok(res);
    } catch (error) {
        console.error("❌ Error deleting admission data", error);
        return fail(res, 500, error.message)
    }
}


