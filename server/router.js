const express = require('express');
const Router = express.Router();

Router.use("/user", require("./users/router"));
Router.use("/asset", require("./asset/router"));
Router.use("/category", require("./category/router"));
Router.use("/expense", require("./expenses/router"));
Router.use("/budget", require("./budget/router"));
Router.use("/borrowAndLent", require("./borrowAndLent/router"));

module.exports = Router