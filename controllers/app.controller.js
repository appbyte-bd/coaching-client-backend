import Banner from "../models/banner.model.js"
import studentModel from "../models/student.model.js";
import WebSettingModel from "../models/webSetting.model.js";

import { ok, fail } from "../utils/response.js";
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const login = async (req, res) => {
    try {
        const { studentId, password } = req.body;

        const student = await studentModel.findOne({ id: studentId });


        if (!student) {
            return fail(res, 404, "Student not found");
        } else if (student.password !== password) {
            return fail(res, 404, "Invalid password");
        }

        return ok(res, student);
    } catch (error) {
        console.error("Error during mobile app login:", error);
        return fail(res, 500, "Internal Server Error");
    }
};


export const getBanners = async (req, res) => {
    try {
        // await delay(5000);

        const banners = await Banner.find();
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const responseBanners = banners.map((banner) => ({
            ...banner.toObject(),
            image: `${baseUrl}/images/${banner.image}`
        }));

        return ok(res, responseBanners)
    } catch (error) {
        console.error("Error fetching banners:", error);
        return fail(res, 500, error.message || "Internal Server Error");
    }
};

export const getAppSetting = async (req, res) => {
    try {
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
