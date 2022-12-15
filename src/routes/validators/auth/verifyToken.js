const { param } = require('express-validator');
const {
    AppError: { ValidationError },
} = require('../../../helpers');
const validator = [
    param('token').custom((val) => {
        if (val?.trim().length !== 25) throw new ValidationError('Invalid token.');
        return true;
    }),
];

module.exports = validator;
