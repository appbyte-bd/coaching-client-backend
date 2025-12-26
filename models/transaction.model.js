import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        trim: true,
        min: 0
    },
    date: {
        type: String,
        required: true,
        trim: true
    },
    note: {
        type: String,
        trim: true
    }
}, {
    timestamps: true,
    versionKey: false
});


export default mongoose.model("Transaction", transactionSchema);

