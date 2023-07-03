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

const validateAddBorrowAndLent = (req, res, next) => {
    const typeDate = moment();
    const schema = Joi.object({
        type: Joi.string()
            .trim()
            .required()
            .valid("lent", "borrow"),
        personName: Joi.string()
            .regex(/^[a-z A-Z]+$/)
            .min(3)
            .max(25)
            .required()
            .trim()
            .messages({
                'string.base': 'playerName must be a string',
                'string.empty': 'playerName cannot be empty',
                'string.min': 'playerName must have at least 3 characters',
                'string.max': 'playerName can have at most 25 characters',
                'any.required': 'playerName is required'
            }),
        amount: Joi.number()
            .required()
            .messages({
                "string.min": "amount must have at least 3 characters",
                'string.max': 'amount can have at most 50 characters',
                'any.required': 'amount is required'
            }),
        typeDate: Joi.date()
            .max(typeDate)
            .required(),
        dueDate: Joi.date()
            .min(typeDate)
            .required()
    });
    checker(schema, req, res, next);
};


const validateUpdateBorrowAndLent = (req, res, next) => {
    const typeDate = moment();
    const schema = Joi.object({
        type: Joi.string()
            .trim()
            .valid("lent", "borrow"),
        personName: Joi.string()
            .regex(/^[a-z A-Z]+$/)
            .min(3)
            .max(25)
            .trim()
            .messages({
                'string.base': 'playerName must be a string',
                'string.empty': 'playerName cannot be empty',
                'string.min': 'playerName must have at least 3 characters',
                'string.max': 'playerName can have at most 25 characters',
                'any.required': 'playerName is required'
            }),
        amount: Joi.number()
            .messages({
                "string.min": "amount must have at least 3 characters",
                'string.max': 'amount can have at most 50 characters',
                'any.required': 'amount is required'
            }),
        typeDate: Joi.date()
            .max(typeDate),
        dueDate: Joi.date()
            .min(typeDate),
        id: Joi.string()
            .min(24)
            .max(24)
    }).or("amount", "personName", "typeDate", "dueDate", "type");
    checker(schema, req, res, next);
};


module.exports = {
    validateAddBorrowAndLent,
    validateUpdateBorrowAndLent
}