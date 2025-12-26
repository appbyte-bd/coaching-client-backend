import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }
}, {
    versionKey: false
});


export default mongoose.model("Subject", subjectSchema);

