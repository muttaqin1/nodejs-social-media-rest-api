const { body } = require('express-validator');
const objectId = require('../objectId');

const validator = [
    body('password')
        .not()
        .isEmpty()
        .withMessage('Password is required.')
        .isString()
        .withMessage('Password must be valid string.')
        .isStrongPassword()
        .withMessage(
            'Password must contain one capital letter one small letter one number and one character'
        )
        .trim(),
    objectId('token'),
];
module.exports = validator;
