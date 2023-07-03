const borrowAndLentService = require("./service");
const userService = require("../users/service");
const AppError = require("../global/error")
const AppResponse = require("../global/response")
const moment = require('moment');
const { message, ROLES } = require("../constant")

const setBorrowAndLent = async (req, res, next) => {
    try {
        let { type, personName, amount, typeDate, dueDate } = req.body;
        personName = personName.toLowerCase().trim();

        // find user by id to check his/her phonenumber
        const userId = req.user.id;

        const userData = await userService.getUserInfo(userId);
        if (userData.length === 0) {
            return next(AppError(message.msg5, 400));
        }
        if (!userData[0].phoneNumber) {
            return next(AppError(message.msg49, 400));
        }
        typeDate = moment(typeDate).utc();
        dueDate = moment(dueDate).utc();

        const createdData = await borrowAndLentService.setBorrowAndLent({ type, personName, amount, typeDate, dueDate, phoneNumber: userData.phoneNumber, userId });
        return res.status(201).json(AppResponse(201, message.msg50, createdData));
    } catch (error) {
        console.log(error);
    }
}

const updateBorrowAndLent = async (req, res, next) => {
    try {
        let { type, personName, amount, typeDate, dueDate } = req.body;
        const balId = req.params.id;
        personName = personName ? personName.toLowerCase().trim() : undefined;
        typeDate = typeDate ? moment(typeDate).utc() : undefined;
        dueDate = dueDate ? moment(dueDate).utc() : undefined;

        const userId = req.user.id;

        const balData = await borrowAndLentService.getBorrowAndLent({ _id: balId });
        if (!balData) {
            return next(AppError(message.msg51, 400));
        }

        if (balData.userId.toString() !== userId) {
            return next(AppError(message.msg52, 400));
        }

        await borrowAndLentService.updateBorrowAndLent({ type, personName, amount, typeDate, dueDate });
        return res.status(200).json(AppResponse(200, message.msg53));
    } catch (error) {
        console.log(error);
    }
}

const deleteBorrowAndLent = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const balId = req.params.id;

        const balData = await borrowAndLentService.getBorrowAndLent({ _id: balId });
        if (!balData) {
            return next(AppError(message.msg51, 400));
        }

        if (balData.userId.toString() !== userId) {
            return next(AppError(message.msg52, 400));
        }

        await borrowAndLentService.updateBorrowAndLent({ _id: balId }, { isDeleted: true });
        return res.status(200).json(AppResponse(200, message.msg53));
    } catch (error) {
        console.log(error);
    }
}

const getAllBorrowAndLent = async (req, res, next) => {
    let { type } = req.query;
    type = type?.toLowerCase().trim();
    const userId = req.user.id;

    const data = await borrowAndLentService.getAllBorrowAndLent(userId, type)
    return res.status(201).json(AppResponse(201, message.msg54, data));
}

module.exports = {
    setBorrowAndLent,
    updateBorrowAndLent,
    deleteBorrowAndLent,
    getAllBorrowAndLent
}