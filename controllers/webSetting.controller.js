import WebSettingModel from "../models/webSetting.model.js";
import { deleteImage } from "../config/sharp.js";
import { ok, fail } from "../utils/response.js";


export const getWebSetting = async (req, res) => {
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
         if (req.body.image) {
            await deleteImage(req.body.image);
        }
        console.error("❌ Error getting webSetting", error);
        return fail(res, 500, error.message);
    }
};


export const updateWebSetting = async (req, res) => {
    try {
        const webSetting = await WebSettingModel.findOne();
        if (!webSetting) {
            return fail(res, 404, "Web setting not found.");
        }
        await WebSettingModel.findByIdAndUpdate(webSetting._id, {...req.body,logo: req.body.image || webSetting.logo }, { new: true });

        if (req.body.image) {
            await deleteImage(webSetting.logo);
        }
        return ok(res, { message: "Web setting updated successfully." });
    } catch (error) {
        console.error("❌ Error updating web setting", error);
        return fail(res, 500, error.message);
    }
};
