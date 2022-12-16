const { body } = require('express-validator');

const validator = [
    body('body')
        .not()
        .isEmpty()
        .withMessage('Comment body is required')
        .isString()
        .withMessage('Comment body must be a valid string.')
        .isLength({ max: 700 })
        .withMessage('Comment length can not be more than 700 characters')
        .trim(),
];

module.exports = validator;
