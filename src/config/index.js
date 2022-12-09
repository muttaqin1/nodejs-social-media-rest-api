module.exports = {
    server: {
        port: process.env.PORT || 8080,
    },
    database: {
        mongo_uri: `${process.env.MONGO_URI}/social-media-app`,
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
}
