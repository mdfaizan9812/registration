const User = require("./model");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const resetService = require("../reset/service");
const { generateOTPCode } = require("../utilities/OTP/otpCode")
const mongoose = require("mongoose");
const { ROLES, message } = require("../constant");
const AppError = require("../global/error");
const ObjectId = mongoose.Types.ObjectId;


const isUserExistByEmail = async (email) => {
    return await User.findOne({ email });
}

const isUserExistById = async (userId) => {
    return await User.findById(userId);
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

const getUserInfo = async (id) => {
    return await User.aggregate([
        { $match: { _id: new ObjectId(id), isDeleted: false } },
        {
            $project: {
                isDeleted: 0,
                createdAt: 0,
                updatedAt: 0,
                password: 0
            }
        }
    ])
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

// user verifycation
const verifyUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
        return res.sendStatus(404);
    }
    if (!token) {
        return next(AppError(message.msg25, 400));
    }
    jwt.verify(token, process.env.SECRETKEY, async (err, user) => {
        if (err) {
            return next(AppError(message.msg26, 400));
        }
        req.user = user;
        const userDetails = await isUserExistById(req.user.id);
        req.user.role = userDetails.role;
        next();
    });
};

const verifyAdmin = (req, res, next) => {
    const admin = req.user.role;
    if (admin === ROLES.ADMIN) {
        next();
    }
    return next(AppError(message.msg27, 400));
}

module.exports = {
    isUserExistByEmail,
    createUser,
    hashedPassword,
    generateOTP,
    matchingOTP,
    updateUser,
    getUserInfo,
    comparePassword,
    generate_Token,
    isUserExistById,
    verifyUser,
    verifyAdmin
}