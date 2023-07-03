const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const borrowAndLentSchema = new mongoose.Schema(
    {
        type: { type: String, required: true, enum: ["lent", "borrow"] },
        personName: { type: String, required: true },
        amount: { type: Number, required: true },
        typeDate: { type: Date, required: true },
        dueDate: { type: Date, required: true },
        userId: { type: ObjectId, ref: "User", required: true },
        isDeleted: { type: Boolean, default: false }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("BorrowLent", borrowAndLentSchema);
