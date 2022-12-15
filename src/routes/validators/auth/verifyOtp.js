const { body } = require('express-validator');
const { validationResult } = require('../../../middlewares');
const objectId = require('../objectId');

const validator = [
    body('otp')
        .not()
        .isEmpty()
        .withMessage('Otp is required.')
        .isString()
        .withMessage('Otp must be a valid string')
        .isLength({ max: 6, min: 6 })
        .withMessage('Otp can not be more or less than 6 character'),
    objectId('otpId'),
];

module.exports = validator;
