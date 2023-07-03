const express = require('express');
const Router = express.Router();
const budgetApis = require('./api');
const budgetValidation = require('./validation');
const userServices = require('../users/service');

Router.post("/set",
    userServices.verifyUser,
    budgetValidation.validateAddBudget,
    budgetApis.setBudget
)

Router.route("/:id")
    .patch(
        userServices.verifyUser,
        budgetValidation.validateUpdateBudget,
        budgetApis.updateBudget
    )
    .delete(
        userServices.verifyUser,
        budgetApis.deleteBudget
    )

Router.get("/",
    userServices.verifyUser,
    budgetApis.getBudget
)


module.exports = Router;