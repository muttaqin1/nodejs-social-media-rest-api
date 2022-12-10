const router = require('express').Router();
const {
    auth: {
        signIn,
        signUp,
        signOut,
        tokenRefresh,
        verifyAccount,
        resendVerificationToken,
        forgotPassword,
        validateOtp,
        resetPassword,
    },
} = require('../controllers');
const { Authentication } = require('../auth');
const {
    Auth: { signin, signup },
} = require('./validators');
const { AsyncHandler } = require('../helpers');

router.post('/auth/signup', signup, AsyncHandler(signUp));
router.post('/auth/signin', signin, AsyncHandler(signIn));
router.delete('/auth/signout', Authentication, AsyncHandler(signOut));
router.put('/auth/token-refresh', Authentication, AsyncHandler(tokenRefresh));
router.post('/auth/account/verify', Authentication, AsyncHandler(verifyAccount));
router.post('/auth/account/resend-token', Authentication, AsyncHandler(resendVerificationToken));
router.post('/auth/account/forgot-password', AsyncHandler(forgotPassword));
router.post('/auth/account/otp/verify', AsyncHandler(validateOtp));
router.post('/auth/account/reset-password', AsyncHandler(resetPassword));

module.exports = router;
