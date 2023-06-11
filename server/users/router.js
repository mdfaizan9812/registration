const express = require('express');
const Router = express.Router();
const userApis = require('./api');
const userValidation = require('./validation');

Router.post("/register",
    userValidation.validateUserRegister,
    userApis.registration
)

module.exports = Router