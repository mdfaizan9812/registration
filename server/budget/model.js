const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const budgetSchema = new mongoose.Schema(
    {
        categoryId: { type: ObjectId, ref: "Category", required: true },
        userId: { type: ObjectId, ref: "User", required: true },
        amount: { type: Number, required: true },
        monthAndYear: { type: Date, required: true },
        isDeleted: { type: Boolean, default: false }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("Budget", budgetSchema);
