const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: { type: "string", require: true },
        description: { type: "string", require: true },
        icon: { type: "string" },
        isDeleted: { type: Boolean, default: false }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("Category", categorySchema);
