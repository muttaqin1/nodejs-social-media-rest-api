const router = require('express').Router()
const {
    auth: { signIn, signup, signOut },
} = require('../controllers')
const { Authentication } = require('../auth')

const signupvalidator = require('../validators/user/signup')
const loginvalidator = require('../validators/user/login')

router.post('/auth/signup', signupvalidator, signup)
router.post('/auth/signin', loginvalidator, signIn)
router.delete('/auth/signout', Authentication, signOut)

module.exports = router
