import Admin from "../models/admin.model.js";
import jwt from "jsonwebtoken";
import { ok, fail } from "../utils/response.js"

export const adminLogin = async (req, res) => {
    try {
        const { name, password } = req.body;
        if (!name || !password) {
            return fail(res, 400, "All fields are required")
        }
        const admin = await Admin.findOne({ name });
        if (!admin) {
            return fail(res, 404, "Admin not found")
        }
        if (admin.password !== password) {
            return fail(res, 404, "Incorrect password");
        }
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 1 * 24 * 60 * 60 * 1000,
            path: "/"
        });
        const { password: adminPassword, ...others } = admin.toObject();

        return ok(res, others)
    } catch (error) {
        console.error("❌ Error admin login", error);
        return fail(res, 500, error.message)
    }
}

export const adminLogout = async (req, res) => {
    try {
        res.clearCookie("token");
        return ok(res, { message: "Admin logged out successfully" })
    } catch (error) {
        console.error("❌ Error Admin logged out", error);
        return fail(res, 500, error.message)
    }
}

export const authAdmin = async (req, res) => {
    try {
        const { password, ...others } = req.admin.toObject();
        return ok(res, others)

        // return ok(res, {
        //     "_id": "68e95f682ac013e34e59843b",
        //     "name": "shahid",
        //     "type": "admin",
        //     "createdAt": "2025-10-10T19:32:56.792Z",
        //     "updatedAt": "2025-11-15T21:45:46.102Z",
        //     "__v": 0
        // });

    } catch (error) {
        console.error("❌ Error admin auth", error);
        return fail(res, 500, error.message)
    }
}

export const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({ type: { $ne: "admin" } }).sort({ createdAt: -1 }).select("_id name type");
        return ok(res, admins)
    } catch (error) {
        console.error("❌ Error get all admin", error);
        return fail(res, 500, error.message)
    }
}

export const createAdmin = async (req, res) => {
    try {
        const { name, password, type } = req.body;
        if (!name || !password || !type) {
            return fail(res, 400, "All fields are required")
        }

        const admin = await Admin.findOne({ name });
        if (admin) {
            return fail(res, 400, "Admin already exists")
        }

        await Admin.create({ name, password, type });
        return ok(res, { message: "Admin created successfully" })
    } catch (error) {
        console.error("❌ Error create admin", error);
        return fail(res, 500, error.message)
    }
};

export const updateAdmin = async (req, res) => {
    try {
        const { name, password, type } = req.body;

        const newAdmin = await Admin.findByIdAndUpdate(req.params.id, { name, password, type }, { new: true });
        if (!newAdmin) {
            return fail(res, 404, "Admin not found")
        }

        return ok(res, { message: "Admin updated successfully" })
    } catch (error) {
        console.error("❌ Error update admin", error);
        return fail(res, 500, error.message)
    }
};

export const deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findByIdAndDelete(req.params.id);
        if (!admin) {
            return res.status(404).json({ success: false, error: "Admin not found" });
        }
        res.status(200).json({ success: true, message: "Admin deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};