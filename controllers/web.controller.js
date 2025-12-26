import ResultModel from "../models/result.model.js";
import AdmissionModel from "../models/admission.model.js";
import ContactModel from "../models/contact.model.js";
import BannerModel from "../models/banner.model.js";
import ProgramModel from "../models/program.model.js";
import TeacherModel from "../models/teacher.model.js";
import CeoModel from "../models/ceo.model.js";
import WebSettingModel from "../models/webSetting.model.js";
import { ok, fail } from "../utils/response.js";

export const createAdmission = async (req, res) => {
    try {
        await AdmissionModel.create(req.body);
        return ok(res)
    } catch (error) {
        console.error("❌ Error Creating Admission", error);
        return fail(res, 500, error.message || "Something went wrong");
    }
}


export const createContact = async (req, res) => {
    console.log(req.body);

    try {
        await ContactModel.create(req.body);
        return ok(res)
    } catch (error) {
        console.error("❌ Error Creating Contact", error);
        return fail(res, 500, error.message || "Something went wrong");
    }
}


export const getResults = async (req, res) => {
    try {
        const results = await ResultModel.find({ 'students.id': req.params.studentId }).sort({ date: -1 });
        return ok(res, results);
    } catch (error) {
        console.error("❌ Error get results by student id", error);
        return fail(res, 500, error.message)
    }
}


export const getToppers = async (req, res) => {
    try {
        // Get all unique classes
        const classes = await ResultModel.distinct('class');
        const toppers = [];
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        for (const className of classes) {
            // Get latest exam for this class
            const lastExam = await ResultModel.findOne({ class: className })
                .populate('students.studentId')
                .sort({ createdAt: -1 })
                .lean();

            if (lastExam && lastExam.students && lastExam.students.length > 0) {
                // Find student with highest marks
                const topper = lastExam.students.reduce((max, student) => {
                    return student.obtainedMarks > max.obtainedMarks ? student : max;
                }, lastExam.students[0]);

                toppers.push({
                    class: className,
                    subject: lastExam.subject,
                    examDate: lastExam.date,
                    totalMarks: lastExam.totalMarks,
                    topper: {
                        name: topper.name,
                        image: topper.studentId.image ? `${baseUrl}/images/${topper.studentId.image}` : null,
                        id: topper.id,
                        // studentId: topper.studentId,
                        obtainedMarks: topper.obtainedMarks
                    }
                });
            }
        }

        return res.status(200).json({
            success: true,
            count: toppers.length,
            data: toppers
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const getBanners = async (req, res) => {
    try {
        const banners = await BannerModel.find().sort({ _id: -1 });

        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const responseBanners = banners.map((banner) => ({
            ...banner.toObject(),
            image: `${baseUrl}/images/${banner.image}`
        }));

        ok(res, responseBanners);
    } catch (error) {
        console.error("Error fetching banners:", error);
        fail(res, 500, error.message || "Failed to fetch banners")
    }
};


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


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


export const getWebSetting = async (req, res) => {
    try {
        // await delay(5000); // Simulate network delay
        const webSetting = await WebSettingModel.findOne().lean();
        if (!webSetting) {
            const newWebSetting = await WebSettingModel.create({});
            return ok(res, newWebSetting);
        }
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const webSettingWithImageURLs = {
            ...webSetting,
            logo: `${baseUrl}/images/${webSetting.logo}`
        };
        return ok(res, webSettingWithImageURLs);
    } catch (error) {
        console.error("❌ Error getting webSetting", error);
        return fail(res, 500, error.message);
    }
};