import ProgramModel from "../models/program.model.js";
import { ok, fail } from "../utils/response.js";
import { deleteImage } from "../config/sharp.js";

export const getAllPrograms = async (req, res) => {
    try {
        const programs = await ProgramModel.find().sort({ createdAt: -1 }).lean();
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const programsWithImageURLs = programs.map(program => {
            return {
                ...program,
                image: `${baseUrl}/images/${program.image}`
            }
        });
        return ok(res, programsWithImageURLs);
    } catch (error) {
        console.error("❌ Error getting programs", error);
        return fail(res, 500, error.message);
    }
};

export const getProgramById = async (req, res) => {
    try {
        const { id } = req.params;
        const program = await ProgramModel.findById(id).lean();
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const programWithImageURLs = {
            ...program,
            image: `${baseUrl}/images/${program.image}`
        };
        return ok(res, programWithImageURLs);
    } catch (error) {
        console.error("❌ Error getting programs", error);
        return fail(res, 500, error.message);
    }
};


export const createProgram = async (req, res) => {
    try {
        const { title, description, features, image } = req.body;
        if (!title || !image || !features || !Array.isArray(features) || features.length === 0) {
            return fail(res, 400, "All fields are required and features must be a non-empty array.");
        }

        await ProgramModel.create({
            title,
            description,
            image,
            features
        });
        return ok(res, { message: "Program createddddddd successfully." });
    } catch (error) {
        console.error("❌ Error creating program", error);
        return fail(res, 500, error.message);
    }
};




export const updateProgram = async (req, res) => {
    try {
        const { id } = req.params;
        const program = await ProgramModel.findByIdAndUpdate(id, req.body);

        if (!program) {
            return fail(res, 404, "Program not found.");
        }
        if (req.body.image) {
            await deleteImage(program.image);
        }

        return ok(res, { message: "Program updated successfully." });
    } catch (error) {
        console.error("❌ Error updating program", error);
        return fail(res, 500, error.message);
    }
};

export const deleteProgram = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProgram = await ProgramModel.findByIdAndDelete(id);
        if (!deletedProgram) {
            return fail(res, 404, "Program not found.");
        }
        if (deletedProgram.image) {
            await deleteImage(deletedProgram.image);
        }
        return ok(res, deletedProgram, "Program deleted successfully.");
    } catch (error) {
        console.error("❌ Error deleting program", error);
        return fail(res, 500, error.message);
    }
};