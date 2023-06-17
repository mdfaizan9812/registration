const express = require('express');
const Router = express.Router();
const userApis = require('./api');
const userValidation = require('./validation');

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

module.exports = Router