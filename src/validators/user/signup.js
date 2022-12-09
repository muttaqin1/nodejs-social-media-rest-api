const { body } = require('express-validator')
const { UserRepository } = require('../../database')
const userRepository = new UserRepository()
const {
    AppError: { BadRequestError },
} = require('../../helpers')

module.exports = [
    body('name')
        .not()
        .isEmpty()
        .withMessage('name can not be empty!')
        .isLength({ max: 32 })
        .withMessage("name can't be more than 32 characters!")
        .trim(),
    body('email')
        .isEmail()
        .withMessage('invalid email address')
        .custom(async (val) => {
            try {
                const user = await userRepository.Find({ email: val })
                if (user) throw new BadRequestError('User already exist')
            } catch (e) {
                throw new Error(e)
            }
        })
        .withMessage('email already exist!')
        .trim(),
    body('password')
        .not()
        .isEmpty()
        .withMessage('password can not be empty!')
        .isStrongPassword()
        .withMessage(
            'password must contain one capital letter one small letter one number and one character'
        ),
    body('birthday')
        .not()
        .isEmpty()
        .withMessage('birthday can not be empty!')
        .isLength({ max: 30 })
        .withMessage("birthdayc can't be more than 30 characters!")
        .trim(),
]
