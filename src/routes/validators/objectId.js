const { param } = require('express-validator');
const {
    AppError: { ValidationError },
} = require('../../helpers');
const { Types } = require('mongoose');
const verifyObjectId = (fieldName) =>
    param(fieldName)
        .not()
        .isEmpty()
        .withMessage('token is required.')
        .custom((val) => {
            if (!Types.ObjectId.isValid(val)) throw new ValidationError('Invalid token');
            return true;
        });

module.exports = verifyObjectId;
