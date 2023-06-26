const Joi = require("joi");
const AppError = require("../global/error");

const checker = (schema, req, res, next) => {
    const { error } = schema.validate({ ...req.body, ...req.query, ...req.params });
    if (error) {
        next(AppError(error, 400));
    } else {
        next();
    }
};

const validateAddCategory = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string()
            .regex(/^[a-z A-Z]+$/)
            .min(3)
            .max(25)
            .required()
            .trim()
            .messages({
                'string.base': 'Name must be a string',
                'string.empty': 'Name cannot be empty',
                'string.min': 'Name must have at least 3 characters',
                'string.max': 'Name can have at most 25 characters',
                'any.required': 'Name is required'
            }),
        description: Joi.string()
            .min(10)
            .max(50)
            .required()
            .trim()
            .messages({
                "string.min": "Description must have at least 10 characters",
                'string.max': 'Description can have at most 50 characters',
                'any.required': 'Description is required'
            }),
    });
    checker(schema, req, res, next);
};

const validateUpdateCategory = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string()
            .regex(/^[a-z A-Z]+$/)
            .min(3)
            .max(25)
            .trim()
            .messages({
                'string.base': 'Name must be a string',
                'string.empty': 'Name cannot be empty',
                'string.min': 'Name must have at least 3 characters',
                'string.max': 'Name can have at most 25 characters',
                'any.required': 'Name is required'
            }),
        description: Joi.string()
            .min(10)
            .max(50)
            .trim()
            .messages({
                "string.min": "Description must have at least 10 characters",
                'string.max': 'Description can have at most 50 characters',
                'any.required': 'Description is required'
            }),
        id: Joi.string().required()
    }).or("name", "description");
    checker(schema, req, res, next);
};


module.exports = {
    validateAddCategory,
    validateUpdateCategory
}