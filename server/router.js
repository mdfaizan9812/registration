const express = require('express');
const Router = express.Router();

Router.use("/user", require("./users/router"));
Router.use("/asset", require("./asset/router"));
Router.use("/category", require("./category/router"));

module.exports = Router