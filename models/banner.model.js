import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
    image: { type: String },
});

export default mongoose.model("Banner", bannerSchema);