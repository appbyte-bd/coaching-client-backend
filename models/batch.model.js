import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    className: {
        type: String,
        required: true,
    },
    monthlyFee: {
        type: String,
        required: true,
    },
    admissionFee: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
},
    {
        timestamps: true,
        versionKey: false
    }
);


// batchSchema.index({ createdAt: 1 }, { expireAfterSeconds: 20 });

const Batch = mongoose.model("Batch", batchSchema);

export default Batch;