const { param } = require('express-validator');
const {
    AppError: { ApiError, BadRequestError },
} = require('../../helpers');
const { Types } = require('mongoose');
console.log(Types.ObjectId);
const verifyObjectId = (fieldName) => [
    param(fieldName)
        .not()
        .isEmpty()
        .withMessage('param is required.')
        .custom((val) => {
            if (!Types.ObjectId.isValid(val))
                throw new BadRequestError('Param contains invalid Id');
        }),
];

module.exports = verifyObjectId;
