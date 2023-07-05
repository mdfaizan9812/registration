const userService = require("./service")
const AppError = require("../global/error")
const AppResponse = require("../global/response")
const { message } = require("../constant");
const { sendMail } = require("../utilities/mail/mailService");
const { MAILCODE, ROLES } = require("../constant");
const moment = require("moment");

const registration = async (req, res, next) => {
    try {

        let { username, email, password } = req.body;
        username = username.toLowerCase().trim();
        email = email.toLowerCase().trim();

        const isUserExist = await userService.isUserExistByEmail(email);

        if (isUserExist && isUserExist.isDeleted === false) {
            return next(AppError(message.msg1, 400));
        }

        password = await userService.hashedPassword(password);
        let user;
        if (isUserExist) {
            isUserExist.username = username;
            isUserExist.password = password;
            isUserExist.save();
            user = isUserExist;
        } else {
            user = await userService.createUser({ username, email, password });
        }
        const otpData = await userService.generateOTP(email)
        sendMail({ username, email, OTP: otpData.code, code: MAILCODE.REGISTRATION });
        return res.status(201).json(AppResponse(201, message.msg2, user));
    } catch (error) {
        console.log(error);
    }
}

// login User
const login = async (req, res, next) => {
    try {
        let { email, password } = req.body;
        email = email.toLowerCase().trim();
        const existingUser = await userService.isUserExistByEmail(email);
        if (!existingUser || existingUser.isDeleted === true) {
            return next(AppError(message.msg5, 400));
        }

        const matchPassword = await userService.comparePassword(password, existingUser.password);
        if (!matchPassword) {
            return next(AppError(message.msg6, 400));
        }
        const token = userService.generate_Token({
            email: existingUser.email,
            id: existingUser._id
        });
        const responseData = {
            _id: existingUser._id,
            username: existingUser.username,
            email: existingUser.email,
            role: existingUser.role,
        };
        return res.status(200).json({
            message: message.msg7,
            token: token,
            data: responseData
        });
    } catch (error) {
        console.log(error);
    }
};



const isMatchedOTP = async (req, res, next) => {
    try {
        const { otp, email, code } = req.body;
        const matchedOTP = await userService.matchingOTP(email, otp);
        if (!matchedOTP) {
            return next(AppError(message.msg3, 400));
        }
        if (code === MAILCODE.REGISTRATION) {
            var msg = message.msg4;
            await userService.updateUser({ email }, { isDeleted: false });
        } else if (code === MAILCODE.RESET_PASSWORD) {
            var msg = message.msg8;
        } else {
            return next(AppError(message.msg9, 400));
        }
        return res.status(200).json(AppResponse(200, msg));
    } catch (error) {
        console.log(error, "isMatchedOTP");
    }
}

const sendOTPForResetPassword = async (req, res, next) => {
    try {
        let { email } = req.body;
        email = email.toLowerCase().trim();
        const isUserExist = await userService.isUserExistByEmail(email);
        if (!isUserExist || isUserExist.isDeleted === true) {
            return next(AppError(message.msg5, 400));
        }
        const otpData = await userService.generateOTP(email)
        sendMail({ username: isUserExist.username, email, OTP: otpData.code, code: MAILCODE.RESET_PASSWORD });
        return res.status(200).json(AppResponse(200, message.msg8));
    } catch (error) {
        console.log(error, "isMatchedOTP");
    }
}

const forgetPassword = async (req, res, next) => {
    let { email, password, otp } = req.body;
    email = email.toLowerCase().trim();
    const isUserExist = await userService.isUserExistByEmail(email);
    if (!isUserExist || isUserExist.isDeleted === true) {
        return next(AppError(message.msg5, 400));
    }

    const matchedOTP = await userService.matchingOTP(email, otp);
    if (!matchedOTP) {
        return next(AppError(message.msg11, 400));
    }
    password = await userService.hashedPassword(password);
    await userService.updateUser({ email, isDeleted: false }, { password });
    return res.status(200).json(AppResponse(200, message.msg10));
}

const changePassword = async (req, res, next) => {
    let { email, previousPassword, password } = req.body;
    email = email.toLowerCase().trim();
    const isUserExist = await userService.isUserExistByEmail(email);
    if (!isUserExist || isUserExist.isDeleted === true) {
        return next(AppError(message.msg5, 400));
    }

    const matchPassword = await userService.comparePassword(previousPassword, isUserExist.password);
    if (!matchPassword) {
        return next(AppError(message.msg12, 400));
    }

    password = await userService.hashedPassword(password);
    await userService.updateUser({ email, isDeleted: false }, { password });
    return res.status(200).json(AppResponse(200, message.msg10));
}


const moreInfo = async (req, res, next) => {
    let { gender, phoneNumber, dob } = req.body;
    const userId = req.user.id;
    const userDetails = await userService.isUserExistById(userId);
    if (!userDetails || userDetails.isDeleted === true) {
        return next(AppError(message.msg5, 400));
    }

    dob = moment(dob).utc();
    await userService.updateUser({ _id: userId, isDeleted: false }, { gender, phoneNumber, dob });
    return res.status(200).json(AppResponse(200, message.msg13));
}

const getUserInfo = async (req, res, next) => {
    const { userId } = req.params;
    if (userId.toString() !== req.user.id) {
        return next(AppError(message.msg14, 400));
    }
    const userDetails = await userService.getUserInfo(userId);
    if (!userDetails.length) {
        return next(AppError(message.msg5, 400));
    }

    return res.status(200).json(AppResponse(200, message.success, userDetails[0]));
}

const updateUser = async (req, res, next) => {
    try {
        let { username, phoneNumber, gender, dob } = req.body;
        const userParamId = req.params.userId
        const userId = req.user.id;
        const userRole = req.user.role;

        if ((userRole === ROLES.USER && userParamId !== userId)) {
            return next(AppError(message.msg18, 400));
        }

        const userData = {
            username: username ? username.toLowerCase().trim() : undefined,
            gender: gender ? gender.toLowerCase().trim() : undefined,
            dob: dob ? moment(dob).utc() : undefined,
            phoneNumber
        };

        await userService.updateUser({ _id: userParamId }, userData);
        return res.status(200).json(AppResponse(200, message.msg19));
    } catch (error) {
        console.log(error);
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.userId
        const reqUserId = req.user.id;
        const userRole = req.user.role;

        if ((userRole === ROLES.USER && userId !== reqUserId)) {
            return next(AppError(message.msg20, 400));
        }

        if ((userRole === ROLES.ADMIN && userId === reqUserId)) {
            return next(AppError(message.msg22, 400));
        }

        await userService.updateUser({ _id: userId }, { isDeleted: true });
        return res.status(200).json(AppResponse(200, message.msg21));
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    registration,
    isMatchedOTP,
    login,
    sendOTPForResetPassword,
    forgetPassword,
    changePassword,
    moreInfo,
    getUserInfo,
    updateUser,
    deleteUser
}