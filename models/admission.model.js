import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true,
        trim: true
    },
    class: {
        type: String,
        required: true,
        trim: true
    },
    course: {
        type: String,
        required: true,
        trim: true
    },
    guardianName: {
        type: String,
        required: true,
        trim: true
    },
    guardianNumber: {
        type: String,
        required: true,
        trim: true
    },
    schoolName: {
        type: String,
        required: true,
        trim: true
    },
    schoolRoll: {
        type: String,
        required: true,
        trim: true
    }
},
    {
        timestamps: true,
    }
);



export default mongoose.model("Admission", admissionSchema);