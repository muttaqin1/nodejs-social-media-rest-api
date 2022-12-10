const JWT = require('./JWT');
const {
    AppError: { AuthenticationFailureError, ApiError },
    sendMail,
} = require('../helpers');
const {
    app_name,
    server: { host },
    JWT: { tokenIssuer, tokenAudience, accessTokenExpiry, refreshTokenExpiry },
} = require('../config');
const bcrypt = require('bcryptjs');

class AuthUtils {
    static async GenerateSalt() {
        return await bcrypt.genSalt();
    }
    static async GeneratePassword(password) {
        const salt = await this.GenerateSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        return { hashedPassword, salt };
    }
    static async ValidatePassword(enteredPass, pass, salt) {
        const generatedPass = await bcrypt.hash(enteredPass, salt);
        return generatedPass === pass;
    }
    static async GetAccessToken(authorization) {
        if (!authorization) throw new AuthenticationFailureError();
        if (!authorization.startsWith('Bearer ')) throw new AuthenticationFailureError();
        return authorization.split(' ')[1];
    }
    static async GetRefreshToken(signedCookies, cookieName) {
        const cookies = Object.keys(signedCookies)?.length > 0 ? signedCookies : false;
        if (!cookies) throw new AuthenticationFailureError();
        const token = cookies[cookieName];
        if (!token) throw new AuthenticationFailureError();
        return token;
    }
    static async CreateTokens(user, accessTokenKey, refreshTokenKey) {
        try {
            const accessToken = await JWT.encode(
                {
                    iss: tokenIssuer,
                    aud: tokenAudience,
                    sub: user,
                    accessTokenKey,
                },
                accessTokenExpiry
            );
            const refreshToken = await JWT.encode(
                {
                    iss: tokenIssuer,
                    aud: tokenAudience,
                    sub: user,
                    refreshTokenKey,
                },
                refreshTokenExpiry
            );

            return {
                accessToken,
                refreshToken,
            };
        } catch (e) {
            throw new ApiError();
        }
    }
    static async SendVerificationEmail({ name, email }, token) {
        const title = 'Account verification token.';
        const body = `<h5>Hi, ${name}</h5><br><p>Please click on the following <a href="${`http://${host}/api/auth/verify-token/${token}`}">link</a> to verify your account.</p> 
                  <br><p>If you dont send this request you can ignore this email.</p>`;
        try {
            return await sendMail({ title, body, email });
        } catch {
            throw new ApiError();
        }
    }
    static async Send2FAMail({ name, email }, otp) {
        const title = `Forgot password Two factor Authentication.`;
        const body = `<h5>Hi ${name}, </h5> <br> <p>We received a request to reset your ${app_name} password. <br>
                      Enter the following code reset your password: <br>
                                  [ ${otp} ]  
</p>`;
        try {
            return await sendMail({ title, body, email });
        } catch {
            throw new ApiError();
        }
    }
}

module.exports = AuthUtils;
