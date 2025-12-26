import mongoose from "mongoose";

const ceoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    bio: {
        type: String,
        trim: true,
    },
    disc: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        required: true,
    },
    fb: {
        type: String,
        trim: true,
    },
}, { timestamps: false, versionKey: false });

export default mongoose.model("Ceo", ceoSchema);