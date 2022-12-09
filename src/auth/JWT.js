const { sign, verify } = require('jsonwebtoken')
const { promisify } = require('util')
const { readFile } = require('fs')
const { join } = require('path')
const {
    AppError: { ApiError, TokenExpiredError, BadTokenError },
} = require('../helpers')

class JWT {
    static async PrivateKey() {
        return promisify(readFile)(join(__dirname, '../../keys/jwtRSA256-private.pem'), 'utf8')
    }
    static async PublicKey() {
        return promisify(readFile)(join(__dirname, '../../keys/jwtRSA256-public.pem'), 'utf8')
    }

    static async encode(payload, expiry) {
        const cert = await this.PrivateKey()
        if (!cert) throw new ApiError('Token generation failure!')
        return promisify(sign)({ ...payload }, cert, { expiresIn: expiry, algorithm: 'RS256' })
    }
    static async validate(token) {
        const cert = await this.PublicKey()
        if (!cert) throw new ApiError('Token generation failure!')
        try {
            return await promisify(verify)(token, cert)
        } catch (e) {
            if (e && e.name === 'TokenExpiredError') throw new TokenExpiredError()
            throw new BadTokenError('Invalid token')
        }
    }
    static async decode(token) {
        const cert = await this.PublicKey()
        try {
            return await promisify(verify)(token, cert, { ignoreExpiration: true })
        } catch (e) {
            throw new BadTokenError(e)
        }
    }
}

module.exports = JWT
