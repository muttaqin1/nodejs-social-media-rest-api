const BaseRepository = require('./Base-Repository')
const Token = require('../models/Token')
const { randomBytes } = require('crypto')

class TokenRepository extends BaseRepository {
    constructor() {
        super(Token, 'Token')
    }
    async CreateVerificationToken(userId) {
        try {
            const token = randomBytes(25).toString('hex')
            return await this.Create({ userId, token })
        } catch {
            throw new ApiError('Failed to create Token!')
        }
    }
}

module.exports = TokenRepository
