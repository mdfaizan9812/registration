const express = require('express');
const Router = express.Router();
const categoryApis = require('./api');
const categoryValidation = require('./validation.js');
const userServices = require('../users/service');

Router.post("/create",
    userServices.verifyUser,
    userServices.verifyAdmin,
    categoryValidation.validateAddCategory,
    categoryApis.addCategory
)

Router.get("/",
    userServices.verifyUser,
    categoryApis.getAllCategory
)

Router.route("/:id")
    .patch(userServices.verifyUser,
        userServices.verifyAdmin,
        categoryValidation.validateUpdateCategory,
        categoryApis.updateCategory
    )
    .delete(userServices.verifyUser,
        userServices.verifyAdmin,
        categoryApis.deleteCategory
    )

module.exports = Router