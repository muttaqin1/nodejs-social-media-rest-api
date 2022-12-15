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
const { validationResult } = require('../middlewares');
router.post('/auth/signup', signupValidator, validationResult, AsyncHandler(signUp));
router.post('/auth/signin', signinValidator, validationResult, AsyncHandler(signIn));
router.delete('/auth/signout', Authentication, AsyncHandler(signOut));
router.put('/auth/token-refresh', Authentication, AsyncHandler(tokenRefresh));
router.post(
    '/auth/verify/:token',
    verifyTokenValidator,
    validationResult,
    Authentication,
    AsyncHandler(verifyAccount)
);
router.post(
    '/auth/resend-token',
    emailValidator,
    validationResult,
    Authentication,
    AsyncHandler(resendVerificationToken)
);
router.post(
    '/auth/password/forgot-password',
    emailValidator,
    validationResult,
    AsyncHandler(forgotPassword)
);
router.post(
    '/auth/2fa/verify/:token',
    verifyOtpValidator,
    validationResult,
    AsyncHandler(validateOtp)
);
router.post(
    '/auth/password/reset/:token',
    resetPassValidator,
    validationResult,
    AsyncHandler(resetPassword)
);
router.put(
    '/auth/password',
    changePassValidator,
    validationResult,
    Authentication,
    AsyncHandler(changePassword)
);
module.exports = router;
