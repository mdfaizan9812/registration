const User = require("./model");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const resetService = require("../reset/service");
const { generateOTPCode } = require("../utilities/OTP/otpCode")


const isUserExistByEmail = async (email) => {
    return await User.findOne({ email });
}

const createUser = async (user) => {
    return await User.create(user);
}

const generateOTP = async (email) => {
    let otpCode;
    while (true) {
        otpCode = generateOTPCode();
        let isFound = await resetService.isOTPExist(otpCode);
        if (!isFound) {
            break;
        }
    }
    return await resetService.createOTP(email, otpCode);
}

const matchingOTP = async (email, otp) => {
    return await resetService.isMatchedOTP(email, otp);
}

const updateUser = async (query, data) => {
    return await User.updateOne(query, data);
}

// ------------------------------------------------------------------------------------

const hashedPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

// compare password
const comparePassword = async (password, dbPassword) => {
    return await bcrypt.compare(password, dbPassword);
};

// generate Token
const generate_Token = (payload) => {
    return jwt.sign(payload, process.env.SECRETKEY);
};

module.exports = {
    isUserExistByEmail,
    createUser,
    hashedPassword,
    generateOTP,
    matchingOTP,
    updateUser,
    comparePassword,
    generate_Token
}