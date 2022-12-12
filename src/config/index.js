module.exports = {
    app_name: process.env.APP_NAME,
    signedCookieSecret: process.env.COOKIE_SECRET,
    user: {
        defaultAvatar: {
            url: process.env.SECURE_URL,
            public_id: process.env.PUBLIC_ID,
        },
    },
    server: {
        port: process.env.PORT || 8080,
        host: process.env.HOST,
    },
    database: {
        mongo_uri: `${process.env.MONGO_URI}/${process.env.APP_NAME}`,
    },
    nodemailer: {
        smtpEmail: process.env.SMTP_EMAIL,
        smtpPassword: process.env.SMTP_PASSWORD,
    },
    cloudinary: {
        cloudName: process.env.CLOUD_NAME,
        apiKey: process.env.API_KEY,
        apiSecret: process.env.API_SECRET,
    },
    JWT: {
        tokenIssuer: process.env.TOKEN_ISSUER,
        tokenAudience: process.env.TOKEN_AUDIENCE,
        accessTokenExpiry: Number(process.env.ACCESS_TOKEN_EXPIRY),
        refreshTokenExpiry: Number(process.env.REFRESH_TOKEN_EXPIRY),
    },
};
