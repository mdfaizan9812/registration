const Budget = require("./model");
const moment = require("moment");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const getBudget = async (query) => {
    return await Budget.findOne({ ...query, isDeleted: false });
}

const setBudget = async (data) => {
    return await Budget.create(data);
}

const updateBudget = async (query, data) => {
    return await Budget.updateOne(query, data);
}

const getAllBudget = async (userId, monthAndYear) => {
    const lastDateOfTheMonth = moment().month(moment(monthAndYear).format("MM")).endOf('month').utc().toDate();
    return await Budget.aggregate([
        {
            $match: {
                userId: new ObjectId(userId),
                monthAndYear: { $gte: monthAndYear.toDate(), $lt: lastDateOfTheMonth },
                isDeleted: false
            }
        },
        {
            $lookup: {
                from: "categories",
                let: { "categoryId": "$categoryId" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$_id", "$$categoryId"] },
                                    { $eq: ["$isDeleted", false] }
                                ]
                            }
                        }
                    }
                ],
                as: "category"
            }
        },
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
        {
            $addFields: {
                categoryName: "$category.name"
            }
        },
        {
            $project: {
                category: 0,
                isDeleted: 0,
                updatedAt: 0,
                createdAt: 0,
                monthAndYear: 0
            }
        }
    ])
}

module.exports = {
    getBudget,
    setBudget,
    updateBudget,
    getAllBudget
}