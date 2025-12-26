import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    s_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Student",
    },
    studentId: {
        type: String,
        required: true,
        trim: true
    },
    feeType: {
        type: String,
        required: true,
        enum: ["Monthly", "Admission", "Course"],
        message: "{VALUE} is not a supported fee type.",
    },
    months: {
        type: [Number],
        validate: {
            validator: function (arr) {
                // ✅ Skip validation if feeType is NOT "Monthly"
                if (this.feeType !== "Monthly") {
                    return true;
                }
                // Only validate for Monthly fee type
                return arr && arr.length > 0 && arr.every(num => num >= 1 && num <= 12);
            },
            message: 'Month must contain at least one value between 1 and 12'
        },
        required: function () {
            return this.feeType === "Monthly";
        }
    },
    year: {
        type: String,
        required: function () {
            return this.feeType === "Monthly";
        },
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    paid: {
        type: Number,
        required: true,
    },
    discount: Number,
    due: Number,
    recievedBy: {
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
    note: String,
},
    {
        timestamps: true,
        versionKey: false
    }
);

paymentSchema.index({ s_id: 1 });
paymentSchema.index({ studentId: 1 });
paymentSchema.index({ months: 1 });
paymentSchema.index({ feeType: 1 });
paymentSchema.index({ isVerified: 1 });

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;