const userService = require("./service")
const AppError = require("../global/error")
const AppResponse = require("../global/response")
const { message } = require("../constant");
const { sendMail } = require("../utilities/mail/mailService");
const { MAILCODE } = require("../constant");

const registration = async (req, res, next) => {
    try {

        let { username, email, password } = req.body;

        const isUserExist = await userService.isUserExistByEmail(email);

        if (isUserExist && isUserExist.isDeleted === false) {
            return next(AppError(message.msg1, 400));
        }

        password = await userService.hashedPassword(password);
        let user;
        if (isUserExist) {
            isUserExist.username = username;
            isUserExist.email = email;
            isUserExist.password = password;
            isUserExist.isDeleted = true;
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

const isMatchedOTP = async (req, res, next) => {
    try {
        const { otp, email } = req.body;
        const matchedOTP = await userService.matchingOTP(email, otp);
        if (!matchedOTP) {
            return next(AppError(message.msg3, 400));
        }
        await userService.updateUser({ email }, { isDeleted: false });
        return res.status(200).json(AppResponse(201, message.msg4));
    } catch (error) {
        console.log(error, "isMatchedOTP");
    }
}

module.exports = {
    registration,
    isMatchedOTP
}