const Joi = require("joi");
const AppError = require("../global/error");
const moment = require('moment');

const checker = (schema, req, res, next) => {
    const { error } = schema.validate({ ...req.body, ...req.query, ...req.params });
    if (error) {
        next(AppError(error, 400));
    } else {
        next();
    }
};

const validateAddExpense = (req, res, next) => {
    const schema = Joi.object({
        productName: Joi.string()
            .regex(/^[a-z A-Z]+$/)
            .min(3)
            .max(25)
            .required()
            .trim()
            .messages({
                'string.base': 'productName must be a string',
                'string.empty': 'productName cannot be empty',
                'string.min': 'productName must have at least 3 characters',
                'string.max': 'productName can have at most 25 characters',
                'any.required': 'productName is required'
            }),
        categoryId: Joi.string()
            .min(24)
            .max(24)
            .required()
            .trim()
            .messages({
                "string.min": "categoryId must have at least 24 characters",
                'string.max': 'categoryId can have at most 24 characters',
                'any.required': 'categoryId is required'
            }),
        paymentMethod: Joi.string()
            .regex(/^[a-z A-Z]+$/)
            .min(3)
            .max(25)
            .required()
            .trim()
            .messages({
                'string.base': 'paymentMethod must be a string',
                'string.empty': 'paymentMethod cannot be empty',
                'string.min': 'paymentMethod must have at least 3 characters',
                'string.max': 'paymentMethod can have at most 25 characters',
                'any.required': 'paymentMethod is required'
            }),
        cost: Joi.number().required(),
        note: Joi.string().trim(),
        date: Joi.date()
            .max(moment().format())
            .messages({ "date.max": "Date can not be past" }),
    });
    checker(schema, req, res, next);
};

const validateUpdateExpense = (req, res, next) => {
    const schema = Joi.object({
        productName: Joi.string()
            .regex(/^[a-z A-Z]+$/)
            .min(3)
            .max(25)
            .trim()
            .messages({
                'string.base': 'productName must be a string',
                'string.empty': 'productName cannot be empty',
                'string.min': 'productName must have at least 3 characters',
                'string.max': 'productName can have at most 25 characters',
                'any.required': 'productName is required'
            }),
        categoryId: Joi.string()
            .min(24)
            .max(24)
            .trim()
            .messages({
                "string.min": "categoryId must have at least 24 characters",
                'string.max': 'categoryId can have at most 24 characters',
                'any.required': 'categoryId is required'
            }),
        paymentMethod: Joi.string()
            .regex(/^[a-z A-Z]+$/)
            .min(3)
            .max(25)
            .trim()
            .messages({
                'string.base': 'paymentMethod must be a string',
                'string.empty': 'paymentMethod cannot be empty',
                'string.min': 'paymentMethod must have at least 3 characters',
                'string.max': 'paymentMethod can have at most 25 characters',
                'any.required': 'paymentMethod is required'
            }),
        cost: Joi.number(),
        note: Joi.string().trim(),
        date: Joi.date()
            .max(moment().format())
            .messages({ "date.max": "Date can not be past" }),
        id: Joi.string()
            .min(24)
            .max(24)
            .required()
            .trim()
            .messages({
                "string.min": "Id must have at least 24 characters",
                'string.max': 'Id can have at most 24 characters',
                'any.required': 'Id is required'
            }),
    }).or("productName", "cost", "note", "date", "categoryId", "paymentMethod");
    checker(schema, req, res, next);
};

module.exports = {
    validateAddExpense,
    validateUpdateExpense
}