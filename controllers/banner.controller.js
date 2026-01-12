import Banner from "../models/banner.model.js"
import { deleteImage } from "../config/sharp.js";

export const createBanner = async (req, res) => {
    try {
        await Banner.create({ image: req.body.image });
        res.status(201).json({ success: true, message: "Banner created successfully" });
    } catch (error) {
        if (req.body.image) {
            await deleteImage(req.body.image);
        }
        console.error("❌ Error Add Banner", error);
        res.status(500).json({ success: false, error: error.message });
    }
};


export const getBanners = async (req, res) => {
    try {
        const banners = await Banner.find();
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const responseBanners = banners.map((banner) => ({
            ...banner.toObject(),
            image: `${baseUrl}/images/${banner.image}`
        }));
         
        res.status(200).json({
            success: true,
            message: "Banners fetched successfully",
            data: responseBanners,
        });
    } catch (error) {
        console.error("Error fetching banners:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch banners",
            error: error.message,
        });
    }
};


export const deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndDelete(req.params.id);
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found",
            });
        }
        await deleteImage(banner.image);
        res.status(200).json({
            success: true,
            message: "Banner deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting banner:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete banner", 
            error: error.message,
        });
    }
};