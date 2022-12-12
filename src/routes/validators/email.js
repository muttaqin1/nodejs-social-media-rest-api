const { body } = require('express-validator');
const { validationResult } = require('../../middlewares');
const validator = [
    body('email')
        .not()
        .isEmpty()
        .withMessage('Email is required.')
        .isString()
        .withMessage('Email must be a valid string')
        .isEmail()
        .withMessage('Invalid email.'),
];
exports.validator = validator;
module.exports = [validator, validationResult];
