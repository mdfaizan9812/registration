const express = require('express');
const Router = express.Router();
const borrowAndLentApis = require('./api');
const borrowAndLentValidation = require('./validation');
const userServices = require('../users/service');

Router.post("/set",
    userServices.verifyUser,
    borrowAndLentValidation.validateAddBorrowAndLent,
    borrowAndLentApis.setBorrowAndLent
)

Router.route("/:id")
    .patch(
        userServices.verifyUser,
        borrowAndLentValidation.validateUpdateBorrowAndLent,
        borrowAndLentApis.updateBorrowAndLent
    )
    .delete(
        userServices.verifyUser,
        borrowAndLentApis.deleteBorrowAndLent
    )

Router.get("/",
    userServices.verifyUser,
    borrowAndLentApis.getAllBorrowAndLent
)


module.exports = Router;