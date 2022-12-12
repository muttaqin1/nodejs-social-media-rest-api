const { body } = require('express-validator');
const { validationResult } = require('../../../middlewares');
const validator = [
    body('nickname')
        .isString()
        .withMessage('Nickname must be a valid string.')
        .isLength({ max: 22 })
        .withMessage("nickname can't be more than 22 characters")
        .trim(),
    body('bio')
        .isString()
        .withMessage('Bio must be a valid string')
        .isLength({ max: '200' })
        .withMessage("bio cant't be more than 300 characters")
        .trim(),
    body('occupation')
        .isString()
        .withMessage('Occupation must be a valid string.')
        .isLength({ max: '30' })
        .withMessage("occupation cant't be more than 30 characters")
        .trim(),
    body('worksAt')
        .isString()
        .withMessage('Works at must be a valid string.')
        .isLength({ max: '40' })
        .withMessage("worksAt cant't be more than 40 characters")
        .trim(),

    body('address.country')
        .if(body('address').exists())
        .not()
        .isEmpty()
        .withMessage('Country is requried.')
        .isString()
        .withMessage('Country must be a valid string.')
        .trim(),
    body('address.city')
        .if(body('address').exists())
        .not()
        .isEmpty()
        .withMessage('city')
        .isString()
        .withMessage('City must be a valid string.')
        .trim(),
    body('address.zipCode')
        .if(body('address').exists())
        .isNumeric()
        .withMessage('Zipcode must be a valid Number.')
        .isInt()
        .withMessage('Zipcode must be a integer number.'),
    body('address.homeAddress')
        .if(body('address').exists())
        .not()
        .isEmpty()
        .withMessage('home address is required.')
        .isString()
        .withMessage('Home address must be a valid string. ')
        .trim(),
    body('hobbies').if(body('hobbies').exists()).isArray().withMessage('Hobbies must be an array.'),
];
module.exports = [validator, validationResult];
