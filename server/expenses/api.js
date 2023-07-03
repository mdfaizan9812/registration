const expenseService = require("./servce");
const AppError = require("../global/error")
const AppResponse = require("../global/response")
const moment = require('moment');
const { message, ROLES } = require("../constant")

const addExpense = async (req, res, next) => {
    try {
        let { productName, categoryId, paymentMethod, cost, note, date } = req.body;
        let userId = req.user.id;
        const expenseData = {
            productName: productName?.toLowerCase().trim(),
            paymentMethod: paymentMethod?.toLowerCase().trim(),
            note: note?.toLowerCase().trim(),
            categoryId,
            cost: parseInt(cost),
            userId,
            date: date ? moment(date).utc() : moment().utc()
        }
        const createdExpense = await expenseService.create(expenseData)
        return res.status(201).json(AppResponse(201, message.msg30, createdExpense));
    } catch (error) {
        console.log(error);
    }
}

const updateExpense = async (req, res, next) => {
    try {
        let { productName, categoryId, paymentMethod, cost, note, date } = req.body;
        const expenseId = req.params.id;
        const expenseDeatils = await expenseService.findExpense({ _id: expenseId });
        if (!expenseDeatils || expenseDeatils.isDeleted === true) {
            return next(AppError(message.msg31, 400));
        }
        if (expenseDeatils.userId.toString() !== req.user.id) {
            return next(AppError(message.msg32, 400));
        }
        const expenseData = {
            productName: productName?.toLowerCase().trim(),
            paymentMethod: paymentMethod?.toLowerCase().trim(),
            note: note?.toLowerCase().trim(),
            categoryId,
            cost: cost ? parseInt(cost) : undefined,
            date: date ? moment(date).utc() : undefined
        }
        await expenseService.updateExpense({ _id: expenseId }, expenseData)
        return res.status(200).json(AppResponse(200, message.msg30));
    } catch (error) {
        console.log(error);
    }
}

const deleteExpense = async (req, res, next) => {
    try {
        const expenseId = req.params.id;
        const expenseDeatils = await expenseService.findExpense({ _id: expenseId });
        if (!expenseDeatils || expenseDeatils.isDeleted === true) {
            return next(AppError(message.msg31, 400));
        }
        if (expenseDeatils.userId.toString() !== req.user.id) {
            return next(AppError(message.msg33, 400));
        }
        await expenseService.updateExpense({ _id: expenseId }, { isDeleted: true })
        return res.status(200).json(AppResponse(200, message.msg34));
    } catch (error) {
        console.log(error);
    }
}

const getAllExpensesByMonth = async (req, res) => {
    try {
        let { page, limit, month, year } = req.query;
        page = Number(page);
        limit = Number(limit);

        // find all expenses
        const allExpenses = await expenseService.getAllExpensesByMonth(page, limit, month, year)
        console.log(allExpenses);
        if (allExpenses.length === 0) {
            return next(AppError(message.msg31, 400));
        }
        if (!page || !limit) {
            allExpenses[0].totalExpenses = allExpenses[0].totalExpenses[0].totalAmount
            return res.status(200).json(AppResponse(200, message.msg36, allExpenses[0]));
        }

        allExpenses[0].totalExpenses = allExpenses[0].totalExpenses[0].totalAmount
        return res.status(200).json(
            AppResponse(
                200,
                message.msg36,
                {
                    total: allExpenses[0].totalCount[0].totalExpensesCount,
                    currentPage: parseInt(page),
                    prevPage: page <= 1 ? 1 : parseInt(page) - 1,
                    maxPage: Math.ceil(
                        allExpenses[0].totalCount[0].totalExpensesCount / limit
                    ),
                    allExpenses: allExpenses[0]
                }
            ));
    } catch (error) {
        console.log(error);
    }
}

const getLastThreeMonthsExpenses = async (req, res) => {
    try {
        const userId = req.params.id;
        if (userId !== req.user.id && req.user.role === ROLES.USER) {
            return next(AppError(message.msg38, 400));
        }
        const expenseData = await expenseService.LastThreeMonthsExpenses(userId);
        return res.status(200).json(AppResponse(200, message.msg37, expenseData));
    } catch (error) {
        console.log(error);
    }
}

const getExpenseByDate = async (req, res) => {
    try {
        const { key1, key2, key3, catId } = req.query;

        let date;
        let categoryId;
        if (key1 && key2 && key3) {
            date = `${key1}-${key2}-${key3}`;
            date = moment(date).utc();
        } else if (catId) {
            categoryId = catId;
        } else {
            return next(AppError(message.msg40, 400));
        }

        const userId = req.params.id;
        if (userId !== req.user.id && req.user.role === ROLES.USER) {
            return next(AppError(message.msg38, 400));
        }

        const expenseData = await expenseService.getExpenseByDate(userId, date, categoryId)
        return res.status(200).json(AppResponse(200, message.msg39, expenseData));
    } catch (error) {
        console.log(error);
    }
}

const getTotalExpenseByPaymentMethod = async (req, res) => {
    try {
        const userId = req.user.id;
        const type = req.query?.type?.toLowerCase()?.trim();
        const getTotalExpense = await expenseService.getTotalExpenseByPaymentMethod(userId, type);
        return res.status(200).json(AppResponse(200, message.msg39, getTotalExpense));

    } catch (error) {
        console.log(error);
    }
}



module.exports = {
    addExpense,
    updateExpense,
    deleteExpense,
    getAllExpensesByMonth,
    getLastThreeMonthsExpenses,
    getExpenseByDate,
    getTotalExpenseByPaymentMethod
}