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

module.exports = {
    registration
}