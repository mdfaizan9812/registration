const express = require('express');
const Router = express.Router();
const expenseApis = require('./api');
const expenseValidation = require('./validation.js');
const userServices = require('../users/service');

Router.post("/add",
    userServices.verifyUser,
    expenseValidation.validateAddExpense,
    expenseApis.addExpense
)

Router.route("/:id")
    .patch(userServices.verifyUser,
        expenseValidation.validateUpdateExpense,
        expenseApis.updateExpense
    )
    .delete(userServices.verifyUser,
        expenseApis.deleteExpense
    )
Router.get("/", userServices.verifyUser, expenseApis.getAllExpensesByMonth);
Router.get("/:id", userServices.verifyUser, expenseApis.getLastThreeMonthsExpenses);
Router.get("/date/:id", userServices.verifyUser, expenseApis.getExpenseByDate);


module.exports = Router