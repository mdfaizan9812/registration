const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const expenseSchema = new mongoose.Schema(
    {
        productName: { type: "string", require: true },
        categoryId: { type: ObjectId, ref: "Category", required: true },
        userId: { type: ObjectId, ref: "User", required: true },
        date: { type: "date", required: true },
        paymentMethod: { type: "string", required: true },
        cost: { type: "number", required: true },
        note: { type: "string" },
        isDeleted: { type: Boolean, default: false }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("Expense", expenseSchema);
