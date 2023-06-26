const userService = require("../users/service");
const categoryService = require("../category/service");
const AppError = require("../global/error")
const AppResponse = require("../global/response")
const { MAILCODE, message } = require("../constant");
const { removeImage } = require('./service')

const uploadOne = async (req, res, next) => {
    try {
        let { email, code, categoryId } = req.body;
        email = email && email.toLowerCase().trim();
        code = code && code.toLowerCase().trim();
        if (!code) {
            removeImage(req.files.file[0].path)
            return next(AppError(message.msg15, 400));
        }
        let image

        // for the user
        if (code === MAILCODE.REGISTRATION) {
            if (!email) {
                removeImage(req.files.file[0].path)
                return next(AppError(message.msg16, 400));
            }
            image = req.files.file[0].path
            await userService.updateUser({ email }, { image })
        }
        // for the category
        else if (code === MAILCODE.CATEGORY) {
            if (!categoryId) {
                removeImage(req.files.file[0].path)
                return next(AppError(message.msg16, 400));
            }
            icon = req.files.file[0].path
            await categoryService.updateCategory({ _id: categoryId }, { icon })
        }
        let imageData = image || icon
        return res.status(201).json(AppResponse(200, message.msg17, imageData));

    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    uploadOne
}