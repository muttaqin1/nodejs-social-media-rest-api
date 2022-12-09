const JWT = require('./JWT')
const {
    AppError: { AuthenticationFailureError, ApiError },
} = require('../helpers')
const {
    JWT: { tokenIssuer, tokenAudience, accessTokenExpiry, refreshTokenExpiry },
} = require('../config')
const bcrypt = require('bcryptjs')

class AuthUtils {
    static async GenerateSalt() {
        return await bcrypt.genSalt()
    }
    static async GeneratePassword(password) {
        const salt = await this.GenerateSalt()
        const hashedPassword = await bcrypt.hash(password, salt)
        return { hashedPassword, salt }
    }
    static async ValidatePassword(enteredPass, pass, salt) {
        const generatedPass = await bcrypt.hash(enteredPass, salt)
        return generatedPass === pass
    }
    static async validateAccessToken(authorization) {
        if (!authorization) throw new AuthenticationFailureError()
        if (!authorization.startsWith('Bearer ')) throw new AuthenticationFailureError()
        return authorization.split(' ')[1]
    }
    static async ValidateRefreshToken(signedCookies, cookieName) {
        const cookies = Object.keys(signedCookies)?.length > 0 ? signedCookies : false
        if (!cookies) throw new AuthenticationFailureError()
        const token = cookies[cookieName]
        if (!token) throw new AuthenticationFailureError()
        return token
    }
    static async createTokens(user, accessTokenKey, refreshTokenKey) {
        try {
            const accessToken = await JWT.encode(
                {
                    iss: tokenIssuer,
                    aud: tokenAudience,
                    sub: user,
                    accessTokenKey,
                },
                accessTokenExpiry
            )
            const refreshToken = await JWT.encode(
                {
                    iss: tokenIssuer,
                    aud: tokenAudience,
                    sub: user,
                    refreshTokenKey,
                },
                refreshTokenExpiry
            )

            return {
                accessToken,
                refreshToken,
            }
        } catch (e) {
            throw new ApiError()
        }
    }
}

module.exports = AuthUtils
