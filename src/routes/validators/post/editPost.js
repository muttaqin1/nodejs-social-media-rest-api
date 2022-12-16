const { body } = require('express-validator');

module.exports = [
    body('caption')
        .isString()
        .withMessage('post Caption must be a valid string.')
        .isLength({ max: 250 })
        .withMessage('caption can not be more than 250 charactes'),
    body('body')
        .isString()
        .withMessage('Post body must be a vald string.')
        .isLength({ max: 6000 })
        .withMessage('post can not be more than 6000 charactes'),
];
