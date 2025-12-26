import Course from "../models/course.model.js";

export const createCourse = async (req, res) => {
    try {
        const { name, className, courseFee, admissionFee } = req.body;
        if (!name || !className || !courseFee || !admissionFee) {
            return res.status(400).json({ status: 400, message: "Please fill all fields" });
        }
        const existingCourse = await Course.findOne({ name });
        if (existingCourse) {
            return res.status(400).json({ status: 400, error: "This Course already exists" });
        }
        const course = new Course({
            name,
            className,
            courseFee,
            admissionFee
        });

        await course.save();
        res.status(201).json({ status: 201, message: "Course created successfully" });
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
};

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 });
        res.status(200).json({ status: 200, message: "Courses fetched successfully", data: courses });
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
};


export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        res.status(200).json({ status: 200, message: "Course fetched successfully", data: course });
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
};

export const updateCourse = async (req, res) => {
    try {
        const { name, className, courseFee, admissionFee } = req.body;

        if (!name || !className || !courseFee || !admissionFee) {
            return res.status(400).json({ status: 400, message: "Please fill all fields" });
        }
        await Course.findByIdAndUpdate(req.params.id, { name, className, courseFee, admissionFee }, { new: true });
        res.status(200).json({ status: 200, message: "Course updated successfully" });
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: 200, message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    }
};
