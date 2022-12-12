const { body } = require('express-validator');
const { validationResult } = require('../../../middlewares');

const validator = [
    body('oldPassword')
        .not()
        .isEmpty()
        .withMessage('Old password is required.')
        .isString()
        .withMessage('Old password must be valid string.')
        .isStrongPassword()
        .withMessage(
            'Password must contain one capital letter one small letter one number and one character'
        )
        .trim(),
    body('newPassword')
        .not()
        .isEmpty()
        .withMessage('New password is required.')
        .isString()
        .withMessage('New password must be valid string.')
        .isStrongPassword()
        .withMessage(
            'Password must contain one capital letter one small letter one number and one character'
        )
        .trim(),
];

module.exports = [validator, validationResult];
