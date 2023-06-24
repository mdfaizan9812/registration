const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: { type: "string", require: true },
        email: { type: "string", require: true },
        password: { type: "string", require: true },
        phoneNumber: { type: "string", require: false },
        gender: { type: "string", require: false, enum: ["male", "female", "other"] },
        role: { type: "string", default: "user", enum: ["admin", "user"] },
        dob: { type: "date", require: false },
        image: { type: "string", require: false },
        isDeleted: { type: Boolean, default: true }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("User", userSchema);
