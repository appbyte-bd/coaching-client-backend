import mongoose from "mongoose";

const expenceCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }
}, {
    versionKey: false,
    timestamps: true
});


export default mongoose.model("ExpenceCategory", expenceCategorySchema);

