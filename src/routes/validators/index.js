module.exports = {
    objectIdValidator: require('./objectId'),
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
    },
    post: {
        createPostValidator: require('./post/createPost'),
        editPostValidator: require('./post/editPost'),
    },
    comment: {
        createCommentValidator: require('./comment/createComment'),
        editCommentValidator: require('./comment/editComment'),
    },
    reply: {
        createReplyValidator: require('./reply/createReply'),
        editReplyValidator: require('./reply/editReply'),
    },
};
