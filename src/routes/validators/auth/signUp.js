const { body } = require('express-validator');
const { UserRepository } = require('../../../database');
const userRepository = new UserRepository();
const {
    AppError: { ValidationError, ApiError },
} = require('../../../helpers');
const { validationResult } = require('../../../middlewares');

const validator = [
    body('name')
        .not()
        .isEmpty()
        .withMessage('Name can not be empty!')
        .isString()
        .withMessage('Name must be valid string.')
        .isLength({ max: 32 })
        .withMessage("Name can't be more than 32 characters!")
        .trim(),
    body('email')
        .isString()
        .withMessage('Email must be valid string.')
        .isEmail()
        .withMessage('Invalid email address')
        .custom(async (val) => {
            try {
                const user = await userRepository.FindOne({ email: val });
                if (user) throw new ValidationError('User already exist');
                return true;
            } catch (e) {
                throw new ApiError();
            }
        })
        .withMessage('Email is already associated with another account.')
        .trim(),
    body('password')
        .not()
        .isEmpty()
        .withMessage('Password can not be empty!')
        .isString()
        .withMessage('Password must be valid string.')
        .isStrongPassword()
        .withMessage(
            'Password must contain one capital letter one small letter one number and one character'
        )
        .trim(),
    body('birthday')
        .not()
        .isEmpty()
        .withMessage('Birthday can not be empty!')
        .isString()
        .withMessage('Birthday must be valid string')
        .isLength({ max: 30 })
        .withMessage("Birthdayc can't be more than 30 characters!")
        .trim(),
    body('gender')
        .not()
        .isEmpty()
        .withMessage('Gender is required.')
        .isIn(['male', 'female', 'custom'])
        .withMessage('Gender can be male, female, custom')
        .trim(),
];
module.exports = [validator, validationResult];
