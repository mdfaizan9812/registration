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

const validateUserRegister = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string()
            .regex(/^[a-z A-Z]+$/)
            .min(3)
            .max(25)
            .required()
            .trim()
            .messages({
                'string.base': 'Username must be a string',
                'string.empty': 'Username cannot be empty',
                'string.min': 'Username must have at least 3 characters',
                'string.max': 'Username can have at most 25 characters',
                'any.required': 'Username is required'
            }),
        email: Joi.string()
            .email()
            .min(3)
            .max(50)
            .required()
            .trim()
            .messages({
                "string.min": "Email must have at least 3 characters",
                'string.max': 'Email can have at most 50 characters',
                'any.required': 'Email is required'
            }),
        password: Joi.string()
            .min(6)
            .max(25)
            .trim()
            .required()
            .messages({
                "string.min": "Password must have at least 6 characters",
                "string.max": "Password can have at most 25 characters",
                'any.required': 'Password is required'
            }),
    });
    checker(schema, req, res, next);
};

const validateOTP = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .min(3)
            .max(50)
            .required()
            .trim()
            .messages({
                "string.min": "Email must have at least 3 characters",
                'string.max': 'Email can have at most 50 characters',
                'any.required': 'Email is required'
            }),
        otp: Joi.string()
            .min(6)
            .max(6)
            .trim()
            .required()
            .messages({
                "string.min": "OTP must have at least 6 characters",
                "string.max": "OTP can have at most 25 characters",
                'any.required': 'OTP is required'
            }),
        code: Joi.string()
            .required()
    });
    checker(schema, req, res, next);
};

const validatePassword = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .min(3)
            .max(50)
            .required()
            .trim()
            .messages({
                "string.min": "Email must have at least 3 characters",
                'string.max': 'Email can have at most 50 characters',
                'any.required': 'Email is required'
            }),
        password: Joi.string()
            .min(6)
            .max(25)
            .trim()
            .required()
            .messages({
                "string.min": "Password must have at least 6 characters",
                "string.max": "Password can have at most 25 characters",
                'any.required': 'Password is required'
            }),
    });
    checker(schema, req, res, next);
};


const validateEmail = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .min(3)
            .max(50)
            .required()
            .trim()
            .messages({
                "string.min": "Email must have at least 3 characters",
                'string.max': 'Email can have at most 50 characters',
                'any.required': 'Email is required'
            })
    });
    checker(schema, req, res, next);
};

const validateForgetPassword = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .min(3)
            .max(50)
            .required()
            .trim()
            .messages({
                "string.min": "Email must have at least 3 characters",
                'string.max': 'Email can have at most 50 characters',
                'any.required': 'Email is required'
            }),
        password: Joi.string()
            .min(6)
            .max(25)
            .trim()
            .required()
            .messages({
                "string.min": "Password must have at least 6 characters",
                "string.max": "Password can have at most 25 characters",
                'any.required': 'Password is required'
            }),
        cPassword: Joi.string().required().valid(Joi.ref('password')),
        otp: Joi.string()
            .min(6)
            .max(6)
            .trim()
            .required()
            .messages({
                "string.min": "OTP must have at least 6 characters",
                "string.max": "OTP can have at most 25 characters",
                'any.required': 'OTP is required'
            }),

    });
    checker(schema, req, res, next);
};

const validateChangePassword = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .min(3)
            .max(50)
            .required()
            .trim()
            .messages({
                "string.min": "Email must have at least 3 characters",
                'string.max': 'Email can have at most 50 characters',
                'any.required': 'Email is required'
            }),
        previousPassword: Joi.string()
            .min(6)
            .max(25)
            .trim()
            .required()
            .messages({
                "string.min": "Password must have at least 6 characters",
                "string.max": "Password can have at most 25 characters",
                'any.required': 'Password is required'
            }),
        password: Joi.string()
            .min(6)
            .max(25)
            .trim()
            .required()
            .messages({
                "string.min": "Password must have at least 6 characters",
                "string.max": "Password can have at most 25 characters",
                'any.required': 'Password is required'
            }),
        cPassword: Joi.string()
            .required()
            .valid(Joi.ref('password'))
    });
    checker(schema, req, res, next);
}


module.exports = {
    validateUserRegister,
    validateOTP,
    validatePassword,
    validateEmail,
    validateForgetPassword,
    validateChangePassword
}