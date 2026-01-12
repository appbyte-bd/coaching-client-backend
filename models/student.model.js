import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    id: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    schoolName: String,
    schoolRoll: String,
    className: {
        type: String,
        required: true,
    },
    batch: String,
    batchId: {
        type: String,
        required: function () {
            return this.batch;
        },
    },
    monthlyFee: {
        type: String,
        required: function () {
            return this.batch;
        },
    },
    course: String,
    courseId: {
        type: String,
        required: function () {
            return this.course;
        },
    },
    courseFee: {
        type: String,
        required: function () {
            return this.course;
        },
        trim: true
    },
    guardianName: {
        type: String,
        trim: true
    },
    guardianNumber: {
        type: String,
        required: true,
        trim: true
    },
    studentNumber: String,
    address: String,
    img: String,
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active",
    },
    addedBy: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
    },
    verifiedBy: {
        type: String,
        required: function () { return this.isVerified === true; }
    },
    note: {
        type: String,
        trim: true
    },
},
    {
        timestamps: true,
    }
);


studentSchema.index(
    { id: 1 },
    {
        unique: true,
        partialFilterExpression: { status: "Active" }
    }
);
studentSchema.index({ note: 1 }, { sparse: true });
studentSchema.index({ className: 1 });
studentSchema.index({ batch: 1 });
studentSchema.index({ course: 1 });

const Student = mongoose.model("Student", studentSchema);

export default Student;
