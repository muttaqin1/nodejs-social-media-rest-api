const { body } = require('express-validator');
const { validationResult } = require('../../../middlewares');
const validator = [
    body('email').not().isEmpty().withMessage("email can't be empty"),
    body('password').not().isEmpty().withMessage("password can't be empty"),
];

module.exports = [validator, validationResult];
