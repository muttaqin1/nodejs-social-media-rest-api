const { body } = require('express-validator');
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
module.exports = validator;
