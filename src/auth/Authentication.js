const {
    AppError: { AuthenticationFailureError, BadTokenError },
} = require('../helpers')

const AuthUtils = require('./AuthUtils')
const JWT = require('./JWT')
const { UserRepository, KeyStoreRepository } = require('../database')
const userRepository = new UserRepository()
const keyStoreRepository = new KeyStoreRepository()

const Authentication = async (req, res, next) => {
    try {
        req.accessToken = await AuthUtils.validateAccessToken(req.headers.authorization)
        const { sub, accessTokenKey } = await JWT.validate(req.accessToken)
        if (!sub && !accessTokenKey) throw new BadTokenError('Invalid Access Token.')

        const user = await userRepository.FindById(sub)
        if (!user) throw new AuthenticationFailureError('User is not registered.')
        req.user = user
        const keystore = await keyStoreRepository.FindOne({
            user: req.user?._id,
            primaryKey: accessTokenKey,
        })
        if (!keystore) throw new AuthenticationFailureError('Invalid Access Token.')
        req.keystore = keystore
        return next()
    } catch (error) {
        next(error)
    }
}

module.exports = Authentication
