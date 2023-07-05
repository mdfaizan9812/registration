const express = require('express');
const Router = express.Router();
const userApis = require('./api');
const userValidation = require('./validation');
const userServices = require('./service');

Router.post("/register",
    userValidation.validateUserRegister,
    userApis.registration
)

Router.post("/verify",
    userValidation.validateOTP,
    userApis.isMatchedOTP
)

Router.post("/login",
    userValidation.validatePassword,
    userApis.login
)

Router.post("/sendOTP",
    userValidation.validateEmail,
    userApis.sendOTPForResetPassword
)

Router.post("/forgetPassword",
    userValidation.validateForgetPassword,
    userApis.forgetPassword
)

Router.post("/changePassword",
    userValidation.validateChangePassword,
    userApis.changePassword
)

Router.post("/moreinfo",
    userServices.verifyUser,
    userValidation.validateUserInfo,
    userApis.moreInfo
)

Router.route("/:userId")
    .get(userServices.verifyUser, userApis.getUserInfo)
    .patch(userServices.verifyUser, userValidation.validateUpdateUser, userApis.updateUser)
    .delete(userServices.verifyUser, userApis.deleteUser)

module.exports = Router