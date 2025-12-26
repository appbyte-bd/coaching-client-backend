import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    className: {
        type: String,
        required: true,
    },
    courseFee: {
        type: String,
        required: true,
    },
    admissionFee: {
        type: String,
        required: true,
    }
},
    {
        timestamps: true,
    }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;