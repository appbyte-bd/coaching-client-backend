
import ContactModel from "../models/contact.model.js";
import { ok, fail } from "../utils/response.js";


export const getAllContact = async (req, res) => {
    try {
        const data = await ContactModel.find().sort({ _id: -1 });
        return ok(res, data)
    } catch (error) {
        console.error("❌ Error getting Contact data", error);
        return fail(res, 500, error.message || "Something went wrong");
    }
}


export const deleteContact = async (req, res) => {
    const { id } = req.params;
    try {
        await ContactModel.findByIdAndDelete(id);
        return ok(res);
    } catch (error) {
        console.error("❌ Error deleting contact", error);
        return fail(res, 500, error.message)
    }
}


