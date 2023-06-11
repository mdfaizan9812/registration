const mongoose = require("mongoose");

const resetSchema = new mongoose.Schema(
    {
        email: { type: "string", require: true },
        code: { type: "string", require: true }
    },
    {
        timestamps: true,
        versionKey: false
    }
);
resetSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

module.exports = mongoose.model("Reset", resetSchema);
