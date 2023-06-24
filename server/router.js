const express = require('express');
const Router = express.Router();

Router.use("/user", require("./users/router"));
Router.use("/asset", require("./asset/router"));

module.exports = Router