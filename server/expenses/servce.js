const Expense = require("./model");
const moment = require("moment");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const create = async (data) => {
    return await Expense.create(data);
}

const updateExpense = async (query, data) => {
    return await Expense.updateOne(query, data);
}

const findExpense = async (query) => {
    return await Expense.findOne(query);
}

const getAllExpensesByMonth = async (page, limit, month, year, userId) => {
    if (!month || !year) {
        month = moment().month();
        year = moment().year();
    }

    // find range of the month
    const firstDayOfMonth = moment().year(year).month(month - 1).startOf('month').utc().toDate();
    const lastDayOfMonth = moment().year(year).month(month - 1).endOf('month').utc().toDate();
    if (!page || !limit) {
        return await Expense.aggregate([
            {
                $facet: {
                    "expenses": [
                        {
                            $match: {
                                isDeleted: false,
                                date: {
                                    $gte: firstDayOfMonth,
                                    $lte: lastDayOfMonth
                                },
                                userId: new ObjectId(userId)
                            },
                        }
                    ],
                    "totalExpenses": [
                        {
                            $match: {
                                isDeleted: false,
                                date: {
                                    $gte: firstDayOfMonth,
                                    $lte: lastDayOfMonth
                                },
                                userId: new ObjectId(userId)
                            },

                        }, {
                            $group: {
                                _id: null,
                                totalAmount: { $sum: '$cost' }
                            }
                        }
                    ]
                }
            }

        ])
    } else {
        return await Expense.aggregate([
            {
                $facet: {
                    "expenses": [
                        {
                            $match: {
                                isDeleted: false,
                                date: {
                                    $gte: firstDayOfMonth,
                                    $lte: lastDayOfMonth
                                },
                                userId: new ObjectId(userId)
                            },
                        },
                        { $skip: (page - 1) * limit },
                        { $limit: limit * 1 },
                    ],
                    "totalExpenses": [
                        {
                            $match: {
                                isDeleted: false,
                                date: {
                                    $gte: firstDayOfMonth,
                                    $lte: lastDayOfMonth
                                },
                                userId: new ObjectId(userId)
                            },

                        },
                        { $skip: (page - 1) * limit },
                        { $limit: limit * 1 },
                        {
                            $group: {
                                _id: null,
                                totalAmount: { $sum: '$cost' }
                            }
                        }
                    ],
                    "totalCount": [
                        {
                            $match: {
                                isDeleted: false,
                                date: {
                                    $gte: firstDayOfMonth,
                                    $lte: lastDayOfMonth
                                },
                                userId: new ObjectId(userId)
                            }
                        },
                        { $count: "totalExpensesCount" }
                    ]
                }
            }

        ])
    }
}

const LastThreeMonthsExpenses = async (userId) => {
    const month = moment().format('MM');
    const year = moment().format('YYYY');
    const lastThreeMonths = moment().year(year).month(month - 4).startOf('month').utc().toDate();
    const currentMonth = moment().year(year).month(month - 1).startOf('month').utc().toDate();

    return await Expense.aggregate([
        {
            $match: {
                userId: new ObjectId(userId),
                isDeleted: false,
                date: {
                    $gte: lastThreeMonths,
                    $lt: currentMonth
                }
            },
        },
        {
            $group: {
                _id: { $month: "$date" },
                totalCost: { $sum: "$cost" }
            }
        }
    ])
}

const getExpenseByDate = async (userId, date, categoryId) => {
    if (date) {
        let tomorrow = moment(date).utc().add(1, "days");
        query = {
            $match: {
                isDeleted: false,
                userId: new ObjectId(userId),
                date: {
                    $gte: date.toDate(),
                    $lt: tomorrow.toDate()
                }
            }
        }
    } else {
        query = {
            $match: {
                isDeleted: false,
                userId: new ObjectId(userId),
                categoryId: new ObjectId(categoryId)
            }
        }
    }
    return await Expense.aggregate([
        query
    ])
}

const getTotalExpenseByPaymentMethodOrCategory = async (userId, type) => {
    let queryExpense;
    if (type === "method") {
        queryExpense = "$paymentMethod"
    } else if (type === "category") {
        queryExpense = "$categoryId"
    } else {
        queryExpense = null;
    }
    return await Expense.aggregate([
        {
            $match: {
                userId: new ObjectId(userId),
                isDeleted: false
            }
        },
        {
            $group: {
                _id: queryExpense,
                totalExpenses: { $sum: "$cost" }
            }
        },
        {
            $lookup: {
                from: "categories",
                let: { "categoryId": "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$_id", "$$categoryId"] },
                                    { isDeleted: false },
                                ]
                            }
                        }
                    }
                ],
                as: "category"
            }
        },
        {
            $addFields: {
                categoryName:
                {
                    $cond:
                    {
                        if: { $gte: [{ $size: "$category" }, 1] },
                        then: "$category.name",
                        else: []
                    }
                }
            }
        },
        {
            $unwind: {
                path: "$categoryName",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                category: 0
            }
        }

    ])
}

module.exports = {
    create,
    updateExpense,
    findExpense,
    getAllExpensesByMonth,
    LastThreeMonthsExpenses,
    getExpenseByDate,
    getTotalExpenseByPaymentMethodOrCategory,
}