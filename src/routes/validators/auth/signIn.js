const { body } = require('express-validator');
const validator = [
    body('email')
        .not()
        .isEmpty()
        .withMessage('Email is required.')
        .isString()
        .withMessage('Email must be valid string.')
        .isEmail()
        .withMessage('Please emter a valid Email.')
        .trim(),
    body('password')
        .not()
        .isEmpty()
        .withMessage('password is required.')
        .isString()
        .withMessage('Email must be valid string.')
        .trim(),
];

module.exports = validator;
