const { header } = require('express-validator');
const {
    AppError: { BadRequestError },
} = require('../helpers');
const { validationResult } = require('../middlewares');

const validator = [
    header('authorization')
        .not()
        .isEmpty()
        .withMessage('Authorization header is required.')
        .custom((value) => {
            if (!value.startsWith('Bearer '))
                throw new BadRequestError('Invalid Authorization header.');
            if (!value.split(' ')[1]) throw new BadRequestError('Invalid Authorization header.');
            return true;
        }),
];

module.exports = { AuthBearer: [validator, validationResult] };
