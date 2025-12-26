import mongoose from 'mongoose';
const studentResultSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
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
    obtainedMarks: {
        type: Number,
        required: true,
        min: 0
    },
    guardianNumber: {
        type: String,
        required: true,
        trim: true
    }
}, { _id: false });

// Main Result Schema
const resultSchema = new mongoose.Schema({
    class: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String,
        required: true
    },
    totalMarks: String,
    totalAttend: String,
    totalStudents: {
        type: Number,
        required: true,
        min: 0
    },
    students: [studentResultSchema]
}, {
    timestamps: true,
    versionKey: false
});


resultSchema.index({ 'class': 1 });
resultSchema.index({ 'date': 1 });
export default mongoose.model('Result', resultSchema);
