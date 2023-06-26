const Category = require("./model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;


const findCategory = async (query) => {
    return await Category.findOne(query);
}

const addCategory = async (data) => {
    return await Category.create(data);
}

const updateCategory = async (query, data) => {
    return await Category.updateOne(query, data);
}

const getAllCategory = async () => {
    return Category.aggregate([
        { $match: { isDeleted: false } },
        {
            $project: {
                updatedAt: 0,
                createdAt: 0,
                isDeleted: 0
            }
        }
    ])
}


module.exports = {
    findCategory,
    addCategory,
    updateCategory,
    getAllCategory
}