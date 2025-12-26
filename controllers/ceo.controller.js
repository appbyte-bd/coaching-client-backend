import CeoModel from "../models/ceo.model.js";
import { ok, fail } from "../utils/response.js";
import { deleteImage } from "../config/sharp.js";

export const getAllCeo = async (req, res) => {
    try {
        const ceos = await CeoModel.find().sort({ createdAt: -1 }).lean();
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const ceosWithImageURLs = ceos.map(ceo => {
            return {
                ...ceo,
                image: `${baseUrl}/images/${ceo.image}`
            }
        });
        return ok(res, ceosWithImageURLs);
    } catch (error) {
        console.error("❌ Error getting ceos", error);
        return fail(res, 500, error.message);
    }
};

export const getCeoById = async (req, res) => {
    try {
        const { id } = req.params;
        const ceo = await CeoModel.findById(id).lean();
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const ceoWithImageURLs = {
            ...ceo,
            image: `${baseUrl}/images/${ceo.image}`
        };
        return ok(res, ceoWithImageURLs);
    } catch (error) {
        console.error("❌ Error getting ceo", error);
        return fail(res, 500, error.message);
    }
};


export const createCeo = async (req, res) => {
    try {
        const { name, bio, disc, image, fb } = req.body;
        if (!name || !image) {
            return fail(res, 400, "All fields are required.");
        }

        await CeoModel.create({
            name,
            bio,
            disc,
            image,
            fb
        });
        return ok(res, { message: "Ceo created successfully." });
    } catch (error) {
        console.error("❌ Error creating ceo", error);
        return fail(res, 500, error.message);
    }
};




export const updateCeo = async (req, res) => {
    try {
        const { id } = req.params;
        const ceo = await CeoModel.findByIdAndUpdate(id, req.body);

        if (!ceo) {
            return fail(res, 404, "Ceo not found.");
        }
        if (req.body.image) {
            await deleteImage(ceo.image);
        }

        return ok(res, { message: "Ceo updated successfully." });
    } catch (error) {
        console.error("❌ Error updating ceo", error);
        return fail(res, 500, error.message);
    }
};

export const deleteCeo = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCeo = await CeoModel.findByIdAndDelete(id);
        if (!deletedCeo) {
            return fail(res, 404, "Ceo not found.");
        }
        if (deletedCeo.image) {
            await deleteImage(deletedCeo.image);
        }
        return ok(res, deletedCeo, "Ceo deleted successfully.");
    } catch (error) {
        console.error("❌ Error deleting ceo", error);
        return fail(res, 500, error.message);
    }
};