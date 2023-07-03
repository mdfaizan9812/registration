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

const validateAddBudget = (req, res, next) => {
    const schema = Joi.object({
        categoryId: Joi.string()
            .min(24)
            .max(24)
            .required()
            .trim()
            .messages({
                'string.base': 'categoryId must be a string',
                'string.empty': 'categoryId cannot be empty',
                'string.min': 'categoryId must have at least 3 characters',
                'string.max': 'categoryId can have at most 25 characters',
                'any.required': 'categoryId is required'
            }),
        amount: Joi.number()
            .required()
            .messages({
                "string.min": "amount must have at least 3 characters",
                'string.max': 'amount can have at most 50 characters',
                'any.required': 'amount is required'
            }),
        monthAndYear: Joi.string()
            .min(7)
            .max(10)
            .trim()
            .required()
            .messages({
                "string.min": "monthAndYear must have at least 7 characters",
                "string.max": "monthAndYear can have at most 10 characters",
                'any.required': 'monthAndYear is required'
            }),
    });
    checker(schema, req, res, next);
};


const validateUpdateBudget = (req, res, next) => {
    const schema = Joi.object({
        amount: Joi.number(),
        monthAndYear: Joi.string()
            .min(7)
            .max(10)
            .trim()
            .messages({
                "string.min": "monthAndYear must have at least 7 characters",
                "string.max": "monthAndYear can have at most 10 characters",
            }),
        id: Joi.string()
            .min(24)
            .max(24)
            .required()
            .trim()
            .messages({
                'string.base': 'id must be a string',
                'string.empty': 'id cannot be empty',
                'string.min': 'id must have at least 3 characters',
                'string.max': 'id can have at most 25 characters',
                'any.required': 'id is required'
            }),
    }).or("amount", "monthAndYear");
    checker(schema, req, res, next);
};


module.exports = {
    validateAddBudget,
    validateUpdateBudget
}