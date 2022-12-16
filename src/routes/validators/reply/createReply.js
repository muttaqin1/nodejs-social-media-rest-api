const { body } = require('express-validator');

const validator = [
    body('body')
        .not()
        .isEmpty()
        .withMessage('Reply body is required.')
        .isString()
        .withMessage('Reply body must be a valid string.')
        .isLength({ max: 700 })
        .withMessage('Reply body can not be more than 700 characters')
        .trim(),
];

module.exports = validator;
