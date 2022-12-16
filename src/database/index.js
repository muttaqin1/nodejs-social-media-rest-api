module.exports = {
    connection: require('./connection'),
    UserRepository: require('./repository/User-Repository'),
    KeyStoreRepository: require('./repository/KeyStore-Repository'),
    TokenRepository: require('./repository/Token-Repository'),
    OtpRepository: require('./repository/Otp-Repository'),
    ProfileRepository: require('./repository/Profile-repository'),
    NotificationRepository: require('./repository/Notification-repository'),
    StoryRepository: require('./repository/Story-repository'),
    PostRepository: require('./repository/Post-repository'),
    CommentRepository: require('./repository/Comment-repository'),
    ReplyRepository: require('./repository/Reply-repository'),
};
