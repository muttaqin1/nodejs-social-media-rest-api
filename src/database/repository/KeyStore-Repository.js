const BaseRepository = require('./Base-Repository')
const KeyStore = require('../models/KeyStore')
const { randomBytes } = require('crypto')
const {
    AppError: { ApiError },
} = require('../../helpers')
class KeyStoreRepository extends BaseRepository {
    constructor() {
        super(KeyStore, 'keystore')
    }
    async CreateKeyStore(userId) {
        const accessTokenKey = randomBytes(64).toString('hex')
        const refreshTokenKey = randomBytes(64).toString('hex')
        try {
            return await this.Create({
                user: userId,
                primaryKey: accessTokenKey,
                secondaryKey: refreshTokenKey,
            })
        } catch {
            throw new ApiError()
        }
    }
}
module.exports = KeyStoreRepository
