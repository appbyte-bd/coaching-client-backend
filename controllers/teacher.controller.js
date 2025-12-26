import TeacherModel from "../models/teacher.model.js";
import { ok, fail } from "../utils/response.js";
import { deleteImage } from "../config/sharp.js";

export const getAllTeachers = async (req, res) => {
    try {
        const teachers = await TeacherModel.find().sort({ createdAt: -1 }).lean();
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const teachersWithImageURLs = teachers.map(teacher => {
            return {
                ...teacher,
                image: `${baseUrl}/images/${teacher.image}`
            }
        });
        return ok(res, teachersWithImageURLs);
    } catch (error) {
        console.error("❌ Error getting teachers", error);
        return fail(res, 500, error.message);
    }
};

export const getTeacherById = async (req, res) => {
    try {
        const { id } = req.params;
        const teacher = await TeacherModel.findById(id).lean();
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const teacherWithImageURLs = {
            ...teacher,
            image: `${baseUrl}/images/${teacher.image}`
        };
        return ok(res, teacherWithImageURLs);
    } catch (error) {
        console.error("❌ Error getting teachers", error);
        return fail(res, 500, error.message);
    }
};


export const createTeacher = async (req, res) => {
    try {
        const { name, bio, subject, image } = req.body;
        if (!name || !image) {
            return fail(res, 400, "All fields are required.");
        }

        await TeacherModel.create({
            name,
            bio,
            subject,
            image
        });
        return ok(res, { message: "Teacher created successfully." });
    } catch (error) {
        console.error("❌ Error creating teacher", error);
        return fail(res, 500, error.message);
    }
};




export const updateTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const teacher = await TeacherModel.findByIdAndUpdate(id, req.body);

        if (!teacher) {
            return fail(res, 404, "Teacher not found.");
        }
        if (req.body.image) {
            await deleteImage(teacher.image);
        }

        return ok(res, { message: "Teacher updated successfully." });
    } catch (error) {
        console.error("❌ Error updating teacher", error);
        return fail(res, 500, error.message);
    }
};

export const deleteTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTeacher = await TeacherModel.findByIdAndDelete(id);
        if (!deletedTeacher) {
            return fail(res, 404, "Teacher not found.");
        }
        if (deletedTeacher.image) {
            await deleteImage(deletedTeacher.image);
        }
        return ok(res, deletedTeacher, "Teacher deleted successfully.");
    } catch (error) {
        console.error("❌ Error deleting teacher", error);
        return fail(res, 500, error.message);
    }
};