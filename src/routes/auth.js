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
        changePassword,
    },
} = require('../controllers');
const { Authentication } = require('../auth');
const {
    Auth: {
        signinValidator,
        signupValidator,
        verifyTokenValidator,
        emailValidator,
        verifyOtpValidator,
        resetPassValidator,
        changePassValidator,
    },
} = require('./validators');
const { AsyncHandler } = require('../helpers');

router.post('/auth/signup', signupValidator, AsyncHandler(signUp));
router.post('/auth/signin', signinValidator, AsyncHandler(signIn));
router.delete('/auth/signout', Authentication, AsyncHandler(signOut));
router.put('/auth/token-refresh', Authentication, AsyncHandler(tokenRefresh));
router.post(
    '/auth/verify/:token',
    verifyTokenValidator,
    Authentication,
    AsyncHandler(verifyAccount)
);
router.post(
    '/auth/resend-token',
    emailValidator,
    Authentication,
    AsyncHandler(resendVerificationToken)
);
router.post('/auth/password/forgot-password', emailValidator, AsyncHandler(forgotPassword));
router.post('/auth/2fa/verify/:token', verifyOtpValidator, AsyncHandler(validateOtp));
router.post('/auth/password/reset/:token', resetPassValidator, AsyncHandler(resetPassword));
router.put('/auth/password', changePassValidator, Authentication, AsyncHandler(changePassword));
module.exports = router;
