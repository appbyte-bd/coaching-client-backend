import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    bio: {
        type: String,
        trim: true,
    },
    subject: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        required: true,
    }
}, { timestamps: true, versionKey: false });

export default mongoose.model("Teacher", teacherSchema);