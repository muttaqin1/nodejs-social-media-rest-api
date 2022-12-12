module.exports = {
    Auth: {
        signinValidator: require('./auth/signIn'),
        signupValidator: require('./auth/signUp'),
        verifyTokenValidator: require('./auth/verifyToken'),
        emailValidator: require('./email'),
        verifyOtpValidator: require('./auth/verifyOtp'),
        resetPassValidator: require('./auth/resetPassword'),
        changePassValidator: require('./auth/changePassword'),
    },
    profile: {
        profileValidator: require('./profile/profileValidator'),
        objectIdValidator: require('./objectId'),
    },
};
