import Batch from "../models/batch.model.js";
import { ok, fail } from "../utils/response.js"


export const createBatch = async (req, res) => {
    try {
        const { name, className, monthlyFee, admissionFee } = req.body;

        if (!name || !className || !monthlyFee || !admissionFee) {
            return fail(res, 400, "Please fill all fields");
        }

        const existingBatch = await Batch.findOne({ name });
        if (existingBatch) {
            return fail(res, 400, "This Batch already exists");
        }

        const batch = new Batch({
            name,
            className,
            monthlyFee,
            admissionFee
        });

        await batch.save();
        return ok(res, { message: "Batch created successfully" })
    } catch (error) {
        return fail(res, 500, error.message);
    }
};

export const getBatches = async (req, res) => {
    try {
        const batches = await Batch.find().sort({ createdAt: -1 });
        res.status(200).json({ status: 200, message: "Batches fetched successfully", data: batches });
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
};


export const getBatchById = async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id);
        res.status(200).json({ status: 200, message: "Batch fetched successfully", data: batch });
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
};

export const updateBatch = async (req, res) => {
    try {
        const { name, className, monthlyFee, admissionFee } = req.body;

        if (!name || !className || !monthlyFee || !admissionFee) {
            return res.status(400).json({ status: 400, message: "Please fill all fields" });
        }
        const batch = await Batch.findByIdAndUpdate(req.params.id, { name, className, monthlyFee, admissionFee }, { new: true });
        res.status(200).json({ status: 200, message: "Batch updated successfully" });
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
};

export const deleteBatch = async (req, res) => {
    try {
        const batch = await Batch.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: 200, message: "Batch deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
};
