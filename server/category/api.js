const categoryService = require("./service.js")
const AppError = require("../global/error")
const AppResponse = require("../global/response")
const { message } = require("../constant");

const addCategory = async (req, res, next) => {
    try {
        let { name, description } = req.body;
        name = name.toLowerCase().trim();
        description = description.toLowerCase().trim();

        const categoryDetails = await categoryService.findCategory({ name })

        if (categoryDetails && categoryDetails.isDeleted === false) {
            return next(AppError(message.msg23, 400));
        }

        let createdCategory;
        if (categoryDetails && categoryDetails.isDeleted === true) {
            categoryDetails.isDeleted = false;
            categoryDetails.description = description;
            categoryDetails.save();
        } else {
            createdCategory = await categoryService.addCategory({ name, description });
        }
        return res.status(201).json(AppResponse(201, message.msg24, createdCategory));
    } catch (error) {
        console.log(error);
    }
}

const updateCategory = async (req, res, next) => {
    try {
        let categoryId = req.params.id
        let { name, description } = req.body;
        name = name ? name.toLowerCase().trim() : undefined;
        description = description ? description.toLowerCase().trim() : undefined;
        const categoryDetails = await categoryService.findCategory({ name })

        if (categoryDetails && categoryDetails.isDeleted === false && categoryDetails._id.toString() !== categoryId) {
            return next(AppError(message.msg23, 400));
        }

        let categoryData = {};
        if (name) {
            categoryData.name = name;
        }
        if (description) {
            categoryData.description = description;
        }

        await categoryService.updateCategory({ _id: categoryId }, categoryData);
        return res.status(200).json(AppResponse(200, message.msg25));
    } catch (error) {
        console.log(error);
    }
}

const getAllCategory = async (req, res, next) => {
    try {
        const category = await categoryService.getAllCategory();
        if (!category.length) {
            return next(AppError(message.msg28, 400));
        }
        return res.status(200).json(AppResponse(200, message.msg28, category));
    } catch (error) {
        console.log(error);
    }
}

const deleteCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.id

        const categoryDetails = await categoryService.findCategory({ _id: categoryId })
        if (categoryDetails && categoryDetails.isDeleted === true) {
            return next(AppError(message.msg28, 400));
        }

        await categoryService.updateCategory({ _id: categoryId }, { isDeleted: true });
        return res.status(200).json(AppResponse(200, message.msg29));
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    addCategory,
    updateCategory,
    getAllCategory,
    deleteCategory
}