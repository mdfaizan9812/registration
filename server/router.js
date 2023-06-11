const express = require('express');
const Router = express.Router();

Router.use("/user", require("./users/router"))

module.exports = Router