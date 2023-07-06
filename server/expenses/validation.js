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

const validateKeysAndType = (req, res, next) => {
    const schema = Joi.object({
        type: Joi.string()
            .regex(/^[a-z A-Z]+$/)
            .min(3)
            .max(25)
            .trim()
            .messages({
                'string.base': 'type must be a string',
                'string.empty': 'type cannot be empty',
                'string.min': 'type must have at least 3 characters',
                'string.max': 'type can have at most 25 characters',
                'any.required': 'type is required'
            }),
        key1: Joi.number()
            .min(2010)
            .max(2050)
            .required()
            .messages({
                'string.base': 'key1 must be a string',
                'string.empty': 'key1 cannot be empty',
                'string.min': 'key1 must have at least 4 characters',
                'string.max': 'key1 can have at most 4 characters',
                'any.required': 'key1 is required'
            }),
        key2: Joi.number()
            .min(1)
            .max(31)
            .required()
            .messages({
                'string.base': 'key2 must be a string',
                'string.empty': 'key2 cannot be empty',
                'string.min': 'key2 must have at least 2 characters',
                'string.max': 'key2 can have at most 2 characters',
                'any.required': 'key2 is required'
            }),
    });
    checker(schema, req, res, next);
};

module.exports = {
    validateAddExpense,
    validateUpdateExpense,
    validateKeysAndType
}