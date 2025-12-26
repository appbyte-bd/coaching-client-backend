import mongoose from "mongoose";

const webOtherSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    logo: {
        type: String,
        trim: true,
    },
    slogan: {
        type: String,
        trim: true,
    },
    about: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    map: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
    },
    whatsapp: {
        type: String,
        trim: true,
    },
    fb: {
        type: String,
        trim: true,
    },
    insta: {
        type: String,
        trim: true,
    },
    tiktok: {
        type: String,
        trim: true,
    },
}, { timestamps: false, versionKey: false });

export default mongoose.model("WebsiteOther", webOtherSchema);