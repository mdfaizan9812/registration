const BorrowLent = require('./model');
const moment = require("moment");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const getBorrowAndLent = async (query) => {
    return await BorrowLent.findOne({ ...query, isDeleted: false });
}

const setBorrowAndLent = async (data) => {
    return await BorrowLent.create(data);
}

const updateBorrowAndLent = async (query, data) => {
    return await BorrowLent.updateOne({ ...query, isDeleted: false }, data);
}

const getAllBorrowAndLent = async (userId, type) => {
    const query = {
        userId: new ObjectId(userId),
        type,
        isDeleted: false,
    }
    if (type === "all") {
        query.type = { $in: ["lent", "borrow"] }
    }
    return await BorrowLent.aggregate([
        {
            $match: query
        }
    ]).exec();
}

module.exports = {
    getBorrowAndLent,
    setBorrowAndLent,
    updateBorrowAndLent,
    getAllBorrowAndLent
}