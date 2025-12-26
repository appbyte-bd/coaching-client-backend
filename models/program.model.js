import mongoose from "mongoose";

const programSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        required: true,
    },
    features: {
        type: [String],
        required: true,
        validate: [v => v.length > 0, "A program must have at least one feature."]
    }
}, { timestamps: true, versionKey: false });

export default mongoose.model("Program", programSchema);