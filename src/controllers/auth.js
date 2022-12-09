const { AuthUtils } = require('../auth')
const {
    AppError: { BadRequestError, AuthenticationFailureError },
    ApiResponse,
} = require('../helpers')
const { UserRepository, KeyStoreRepository } = require('../database')
const {
    JWT: { refreshTokenExpiry },
} = require('../config')

const userRepository = new UserRepository()
const keyStoreRepository = new KeyStoreRepository()

const signup = async (req, res, next) => {
    const { name, email, password, birthday, gender } = req.body
    const data = {
        name,
        email,
        birthday,
        gender,
    }
    try {
        const { hashedPassword, salt } = await AuthUtils.GeneratePassword(password)
        data.password = hashedPassword
        data.salt = salt
        const user = await userRepository.Create(data)
        const { primaryKey, secondaryKey } = await keyStoreRepository.CreateKeyStore(user?._id)
        const { accessToken, refreshToken } = await AuthUtils.createTokens(
            user?._id,
            primaryKey,
            secondaryKey
        )
        user.password = null
        user.salt = null
        new ApiResponse(res)
            .sendCookie('REFRESH_TOKEN', refreshTokenExpiry, refreshToken)
            .data({ user, token: { accessToken } })
            .send()
    } catch (e) {
        next(e)
    }
}

const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await userRepository.FindOne({ email }, '+password +salt')
        if (!user) throw new BadRequestError('User is not registered.')
        if (!user.password) throw new BadRequestError('Credential not set.')
        const match = await AuthUtils.ValidatePassword(password, user?.password, user?.salt)
        if (!match) throw new AuthenticationFailureError('Invalid password')
        const { primaryKey, secondaryKey } = await keyStoreRepository.CreateKeyStore(user?._id)
        const { accessToken, refreshToken } = await AuthUtils.createTokens(
            user?._id,
            primaryKey,
            secondaryKey
        )
        user.password = null
        user.salt = null
        new ApiResponse(res)
            .sendCookie('REFRESH_TOKEN', refreshTokenExpiry, refreshToken)
            .data({ user, token: { accessToken } })
            .send()
    } catch (e) {
        next(e)
    }
}

const signOut = async (req, res, next) => {
    try {
        await keyStoreRepository.DeleteOne({ _id: req.keystore?._id })
        new ApiResponse(res).removeCookie('REFRESH_TOKEN').msg('signout successful.').send()
    } catch (e) {
        next(e)
    }
}

const tokenRefresh = async (req, res, next) => {
    const { authorization } = req.headers
    try {
        const AccessToken = await AuthUtils.validateAccessToken(authorization)
        const RefreshToken = await AuthUtils.ValidateRefreshToken(
            req.signedCookies,
            'REFRESH_TOKEN'
        )
        const accessTokenData = await JWT.decode(AccessToken)
        if (!accessTokenData?.sub && !accessTokenData?.accessTokenKey)
            throw new AuthenticationFailureError('Invalid access Token!')

        const user = await userRepository.FindById(accessTokenData.sub)
        if (!user) throw new AuthenticationFailureError('user is not registered!')
        const refreshTokenData = await JWT.decode(RefreshToken)
        if (!refreshTokenData?.sub && !refreshTokenData?.refreshTokenKey)
            throw new AuthenticationFailureError('Invalid refresh Token!')
        if (refreshTokenData.sub !== accessTokenData.sub)
            throw new AuthenticationFailureError('Invalid token')
        const keystore = await keyStoreRepository.FindOne(
            user._id,
            accessTokenData.accessTokenKey,
            refreshTokenData.refreshTokenKey
        )
        if (!keystore) throw new AuthenticationFailureError('Invalid access token')
        await keyStoreRepository.DeleteOne(keystore._id)
        const newKeystore = await keyStoreRepository.Create(user._id)
        const { accessToken, refreshToken } = await AuthUtils.createTokens(
            user._id,
            newKeystore.primaryKey,
            newKeystore.secondaryKey
        )
        new ApiResponse(res)
            .sendCookie('REFRESH_TOKEN', refreshTokenExpiry, refreshToken)
            .status(200)
            .data({ accessToken })
            .send()
    } catch (e) {
        next(e)
    }
}

const deleteAccount = async (req, res, next) => {
    try {
        const story = await Story.find({ creator: req.user._id })
        if (Story.length > 0) {
            story.forEach(async (storyObject) => {
                await Story.deleteOne({ _id: storyObject._id })
            })
        }
        await deletePosts(req.user._id)
        await Profile.deleteOne({ user: req.user._id })
        await User.deleteOne({ _id: req.user._id })

        //unfriend all friends.
        // remove all the pending friend requests which user sended others.
        //remove all friend requests
        res.clearCookie(AUTH_COOKIE_NAME).json({
            success: true,
            error: false,
        })
    } catch (e) {
        next(e)
    }
}

module.exports = {
    signup,
    signIn,
    signOut,
    tokenRefresh,
}
