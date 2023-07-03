const budgetService = require("./service");
const AppError = require("../global/error")
const AppResponse = require("../global/response")
const moment = require('moment');
const { message, ROLES } = require("../constant")

const setBudget = async (req, res, next) => {
    try {
        let { categoryId, amount, monthAndYear } = req.body;
        monthAndYear = moment(monthAndYear).utc();
        const userId = req.user.id

        // check by categoryId and monthAndYear
        const isExist = await budgetService.getBudget({ categoryId, userId, monthAndYear });
        if (isExist) {
            return next(AppError(message.msg41, 400));
        }

        const budgetData = await budgetService.setBudget({ categoryId, userId, amount, monthAndYear });
        return res.status(201).json(AppResponse(201, message.msg42, budgetData));
    } catch (error) {
        console.log(error);
    }
}

const updateBudget = async (req, res, next) => {
    try {
        let { amount, monthAndYear } = req.body;
        const userId = req.user.id;
        const bugetId = req.params.id;
        monthAndYear = monthAndYear ? moment(monthAndYear).utc() : undefined;

        // check by categoryId and monthAndYear
        const isExist = await budgetService.getBudget({ _id: bugetId });
        if (!isExist) {
            return next(AppError(message.msg43, 400));
        }

        if (userId !== isExist.userId.toString() && req.role === ROLES.USER) {
            return next(AppError(message.msg44, 400));
        }

        await budgetService.updateBudget({ amount, monthAndYear });
        return res.status(200).json(AppResponse(200, message.msg45));
    } catch (error) {
        console.log(error);
    }
}

const deleteBudget = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const bugetId = req.params.id;

        // check by categoryId and monthAndYear
        const isExist = await budgetService.getBudget({ _id: bugetId });
        if (!isExist) {
            return next(AppError(message.msg43, 400));
        }

        if (userId !== isExist.userId.toString() && req.role === ROLES.USER) {
            return next(AppError(message.msg46, 400));
        }

        await budgetService.updateBudget({ isDeleted: true });
        return res.status(200).json(AppResponse(200, message.msg47));
    } catch (error) {
        console.log(error);
    }
}

const getBudget = async (req, res, next) => {
    try {
        const userId = req.user.id;
        let { key1, key2 } = req.query;
        const monthAndYear = moment(`${key1}-${key2}`).utc();

        const budgetData = await budgetService.getAllBudget(userId, monthAndYear);
        return res.status(200).json(AppResponse(200, message.msg48, budgetData));
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    setBudget,
    updateBudget,
    deleteBudget,
    getBudget
}