import Student from "../models/student.model.js";
import Result from "../models/result.model.js";
import Payment from "../models/payment.model.js";
import Batch from "../models/batch.model.js";
import Course from "../models/course.model.js";
import { validateStudent } from "../utils/validate.student.js";
import { deleteImage } from "../config/sharp.js";
import { getImageName } from "../utils/getImgName.js";


export const createStudent = async (req, res) => {
    try {
        const studentData = req.body;

        if (!validateStudent(studentData)) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }
        const oldStudent = await Student.findOne({ id: studentData.id, status: "Active" });
        if (oldStudent) {
            return res.status(400).json({ success: false, error: "This ID already exists" });
        }
        const batch = await Batch.findById(studentData?.batchId)
        const course = await Course.findById(studentData?.courseId)
        if (!batch && !course) {
            return res.status(400).json({ success: false, error: "Invalide Batch or Courde id" });
        }
        if (batch && batch.monthlyFee !== studentData.monthlyFee && req.admin?.type !== "admin") {
            studentData.isVerified = false;
        } else if (course && course.courseFee !== studentData.courseFee && req.admin?.type !== "admin") {
            studentData.isVerified = false;
        }

        studentData.addedBy = req.admin?.name || "admin";

        const student = await Student.create({ ...studentData, img: req.body.image });
        res.status(201).json({ success: true, student, message: "Student created successfully" });
    } catch (error) {
        if (req.body.image) {
            await deleteImage(req.body.image);
        }
        console.error("❌ Error add student", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find()
            .sort({ createdAt: -1 })
            .select("-password -schoolName -schoolRoll -monthlyFee -courseFee -studentNumber -address -status -note");

        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const studentsWithImageUrls = students.map((student) => {
            if (student.img) {
                return {
                    ...student.toObject(),
                    img: `${baseUrl}/images/${student.img}`
                }
            }
            return student.toObject();
        });

        res.status(200).json({
            success: true,
            message: "All students fetched successfully",
            data: studentsWithImageUrls
        });
    } catch (error) {
        console.error("❌ Error get all student", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getActiveStudents = async (req, res) => {
    try {
        const students = await Student.find({ status: "Active" })
            .sort({ createdAt: -1 })
            .select("-password -schoolName -schoolRoll -monthlyFee -courseFee -studentNumber -guardianName -address -status -note");

        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const studentsWithImageUrls = students.map((student) => {
            if (student.img) {
                return {
                    ...student.toObject(),
                    img: `${baseUrl}/images/${student.img}`
                }
            }
            return student.toObject(); // Don't forget to return the student if no image
        });

        res.status(200).json({
            success: true,
            message: "Active students fetched successfully",
            data: studentsWithImageUrls
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getInactiveStudents = async (req, res) => {
    try {
        const students = await Student.find({ status: "Inactive" })
            .sort({ createdAt: -1 })
            .select("-password -schoolName -schoolRoll -monthlyFee -courseFee -studentNumber -guardianName -address -status -note");

        const baseUrl = `${req.protocol}://${req.get("host")}`;

        const studentsWithImageUrls = students.map((student) => {
            if (student.img) {
                return {
                    ...student.toObject(),
                    img: `${baseUrl}/images/${student.img}`
                }
            }
            return student.toObject(); // Don't forget to return the student if no image
        });

        res.status(200).json({
            success: true,
            message: "Inactive students fetched successfully",
            data: studentsWithImageUrls
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const discountedStudents = async (req, res) => {
    try {
        // const studentsWithNotes = await Student.find({
        //     note: {
        //         $exists: true,
        //         $nin: ["", null, undefined]
        //     }
        // })
        const students = await Student.find({ isVerified: false })
            .sort({ createdAt: -1 })
            .select("-password -schoolName -schoolRoll -studentNumber -address -status -guardianNumber -guardianName");

        const baseUrl = `${req.protocol}://${req.get("host")}`;

        const studentsWithImageUrls = students.map((student) => {
            if (student.img) {
                return {
                    ...student.toObject(),
                    img: `${baseUrl}/images/${student.img}`
                }
            }
            return student.toObject();
        });
        res.status(200).json({ success: true, data: studentsWithImageUrls });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


export const getAllBatchStudents = async (req, res) => {
    try {
        const students = await Student.find({
            batch: {
                $exists: true,
                $nin: ["", null, undefined]
            },
            status: "Active"
        })
            .sort({ createdAt: -1 })
            .select("-password -schoolName -schoolRoll -studentNumber -address -status -note");

        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const studentsWithImageUrls = students.map((student) => {
            if (student.img) {
                return {
                    ...student.toObject(),
                    img: `${baseUrl}/images/${student.img}`
                }
            }
            return student.toObject();
        });

        res.status(200).json({
            success: true,
            message: "Batch students fetched successfully",
            data: studentsWithImageUrls
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getAllCourseStudents = async (req, res) => {
    try {
        const students = await Student.find({
            course: {
                $exists: true,
                $nin: ["", null, undefined]
            },
            status: "Active"
        })
            .sort({ createdAt: -1 })
            .select("-password -schoolName -schoolRoll -studentNumber -address -status -note");

        const baseUrl = `${req.protocol}://${req.get("host")}`;

        const studentsWithImageUrls = students.map((student) => {
            if (student.img) {
                return {
                    ...student.toObject(),
                    img: `${baseUrl}/images/${student.img}`
                }
            }
            return student.toObject();
        });

        res.status(200).json({
            success: true,
            message: "Course students fetched successfully",
            data: studentsWithImageUrls
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getAllClassStudents = async (req, res) => {
    try {
        const students = await Student.find({
            className: req.params.class,
            status: "Active"
        })
            .sort({ id: 1 })
            .select("-password -schoolName -schoolRoll -studentNumber -address -status -note");

        const baseUrl = `${req.protocol}://${req.get("host")}`;

        const studentsWithImageUrls = students.map((student) => {
            if (student.img) {
                return {
                    ...student.toObject(),
                    img: `${baseUrl}/images/${student.img}`
                }
            }
            return student.toObject();
        });

        res.status(200).json({
            success: true,
            message: "Course students fetched successfully",
            data: studentsWithImageUrls
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ success: false, error: "Student not found" });
        }
        const results = await Result.find({ 'students.id': student.id }).sort({ date: -1 });
        const payments = await Payment.find({ s_id: student._id }).sort({ date: -1 });
        let studentWithImageUrl = student;
        if (student.img) {
            const baseUrl = `${req.protocol}://${req.get("host")}`;
            studentWithImageUrl = {
                ...student.toObject(),
                img: `${baseUrl}/images/${student.img}`
                // images: product.images.map(img => getImageUrl(img, baseUrl))
            };
        }
        res.status(200).json({ success: true, message: "student fetched successfully", data: studentWithImageUrl, results, payments });
    } catch (error) {
        console.error("❌ Error fetch student", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getStudentForAdmission = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).lean();
        if (!student) {
            return res.status(500).json({ success: false, error: "Student not found" });
        }
        let studentWithImageUrl = student;
        if (student.batchId) {
            const batch = await Batch.findById(student.batchId)
            student.totalAmount = batch.admissionFee;
        } else if (student.courseId) {
            const course = await Course.findById(student.courseId);
            student.totalAmount = course.admissionFee;
        }
        res.status(200).json({ success: true, message: "student fetched successfully", data: studentWithImageUrl });
    } catch (error) {
        console.error("❌ Error fetch student", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateStudent = async (req, res) => {
    try {
        const studentData = req.body;
        // validate required student data
        if (!validateStudent(studentData)) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }

        // check any student exist with the id and he is different one or not
        // if different make him inactive
        const oldStudent = await Student.findOne({ id: studentData.id, status: "Active" });
        if (oldStudent && oldStudent?._id !== studentData._id) {
            await Student.findOneAndUpdate({ id: oldStudent.id, status: "Active" }, { status: "Inactive" });
        }

        // delete previous image if user put new image
        if (req.body.image && studentData.img) {
            await deleteImage(getImageName(studentData.img));
        }

        // find student batch if student monthly fee less then batch fee make him unverifide
        const batch = await Batch.findById(studentData?.batchId)
        if (!batch) {
            return res.status(400).json({ success: false, error: "Batch Not Found" });
        }
        if (batch.monthlyFee !== studentData.monthlyFee && req.admin?.type !== "admin") {
            studentData.isVerified = false;
        }

        if (studentData.course) studentData.course = "";
        if (studentData.courseId) studentData.courseId = "";
        if (studentData.courseFee) studentData.courseFee = "";

        // update the student
        const student = await Student.findOneAndUpdate({ _id: req.params.id }, { ...studentData, img: req.body.image, status: "Active" }, { new: true });
        if (!student) {
            return res.status(404).json({ success: false, error: "Student not found" });
        }
        res.status(200).json({ success: true, message: "Student updated successfully", data: student });
    } catch (error) {
        if (req.body.image) {
            await deleteImage(req.body.image);
        }
        console.error("❌ Error update student", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateCourseStudent = async (req, res) => {
    try {
        const studentData = req.body;
        // validate required student data
        if (!validateStudent(studentData)) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }


        // check any student exist with the id and he is different one or not
        // if different make him inactive
        const oldStudent = await Student.findOne({ id: studentData.id, status: "Active" });
        if (oldStudent && oldStudent?._id !== studentData._id) {
            await Student.findOneAndUpdate({ id: oldStudent.id, status: "Active" }, { status: "Inactive" });
        }

        // delete previous image if user put new image
        if (req.body.image && studentData.img) {
            await deleteImage(getImageName(studentData.img));
        }

        // find student course if student course fee less then course fee make him unverified
        const course = await Course.findById(studentData?.courseId)
        if (!course) {
            return res.status(400).json({ success: false, error: "Course Not Found" });
        }
        if (course.courseFee !== studentData.courseFee) {
            studentData.isVerified = false;
        }

        if (studentData.batch) studentData.batch = "";
        if (studentData.batchId) studentData.batchId = "";
        if (studentData.monthlyFee) studentData.monthlyFee = "";

        const student = await Student.findOneAndUpdate({ _id: req.params.id }, { ...studentData, img: req.body.image, status: "Active", batch: "", monthlyFee: "" }, { new: true });
        if (!student) {
            return res.status(404).json({ success: false, error: "Student not found" });
        }
        res.status(200).json({ success: true, message: "Student updated successfully", data: student });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ success: false, error: "Student not found" });
        }
        if (student.img) {
            await deleteImage(student.img);
        }
        res.status(200).json({ success: true, message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const idExist = async (req, res) => {
    try {
        const student = await Student.findOne({ id: req.body.id, status: "Active" });
        if (!student) {
            return res.status(200).json({ success: true, available: true });
        }
        res.status(200).json({ success: true, available: false });
    } catch (error) {
        console.error("❌ Error check student id exist", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const verifyStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findByIdAndUpdate(id, { isVerified: true, verifiedBy: req.admin?.name || 'admin' }, { new: true })
        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }
        return res.status(200).json({ success: true, message: "Student verified successfully" });
    } catch (error) {
        console.error("❌ Error verify student", error);
        res.status(500).json({ success: false, error: error.message });
    }
}
export const cancelDiscount = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }

        if (student.batchId) {
            const batch = await Batch.findById(student.batchId)
            if (!batch) {
                return res.status(404).json({ success: false, error: "Batch not found" });
            }
            await Student.findByIdAndUpdate(id,
                {
                    isVerified: true,
                    verifiedBy: req.admin?.name || 'admin',
                    monthlyFee: batch.monthlyFee
                }, { new: true })

            return res.status(200).json({ success: true, message: "Student discount cancelled successfully" });
        } else if (student.courseId) {
            const course = await Course.findById(student.courseId)
            if (!course) {
                return res.status(404).json({
                    success: false,
                    error: 'Course not found'
                });
            }
            await Student.findByIdAndUpdate(id,
                {
                    isVerified: true,
                    verifiedBy: req.admin?.name || 'admin',
                    courseFee: course.courseFee
                }, { new: true })
            return res.status(200).json({ success: true, message: "Student discount cancelled successfully" });
        }
    } catch (error) {
        console.error("❌ Error cancelling student discount", error);
        res.status(500).json({ success: false, error: error.message });
    }
}