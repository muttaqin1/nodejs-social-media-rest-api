const { AuthUtils, JWT } = require('../auth');
const roles = require('../config/roles');
const {
    AppError: { BadRequestError, AuthenticationFailureError, AuthorizationFailureError },
    ApiResponse,
} = require('../helpers');
const {
    UserRepository,
    KeyStoreRepository,
    TokenRepository,
    OtpRepository,
} = require('../database');
const {
    JWT: { refreshTokenExpiry },
} = require('../config');

const userRepository = new UserRepository();
const keyStoreRepository = new KeyStoreRepository();
const tokenRepository = new TokenRepository();
const otpRepository = new OtpRepository();

const signUp = async (req, res, next) => {
    const { name, email, password, birthday, gender } = req.body;
    const data = {
        name,
        email,
        birthday,
        gender,
        roles: [roles.USER],
    };
    const { hashedPassword, salt } = await AuthUtils.GeneratePassword(password);
    data.password = hashedPassword;
    data.salt = salt;
    const user = await userRepository.Create(data);
    const { primaryKey, secondaryKey } = await keyStoreRepository.Create(user?._id);
    const { accessToken, refreshToken } = await AuthUtils.CreateTokens(
        user?._id,
        primaryKey,
        secondaryKey
    );
    user.password = null;
    user.salt = null;
    const token = await tokenRepository.Create(user?._id);
    await AuthUtils.SendVerificationEmail(user, token);
    new ApiResponse(res)
        .sendCookie('REFRESH_TOKEN', refreshTokenExpiry, refreshToken)
        .data({ user, token: { accessToken } })
        .msg('A account verification email has been sended to your email')
        .send();
};

const signIn = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await userRepository.FindOne({ email }, '+password +salt');
    if (!user) throw new BadRequestError('The email is not associated with any account.');
    if (!user.password) throw new BadRequestError('Credential not set.');
    const match = await AuthUtils.ValidatePassword(password, user?.password, user?.salt);
    if (!match) throw new AuthenticationFailureError('Invalid password');
    const { primaryKey, secondaryKey } = await keyStoreRepository.Create(user?._id);
    const { accessToken, refreshToken } = await AuthUtils.CreateTokens(
        user?._id,
        primaryKey,
        secondaryKey
    );
    user.password = null;
    user.salt = null;
    new ApiResponse(res)
        .sendCookie('REFRESH_TOKEN', refreshTokenExpiry, refreshToken)
        .data({ user, token: { accessToken } })
        .send();
};

const signOut = async (req, res, next) => {
    await keyStoreRepository.DeleteOne({ _id: req.keystore?._id });
    new ApiResponse(res).removeCookie('REFRESH_TOKEN').msg('signout successful.').send();
};

const tokenRefresh = async (req, res, next) => {
    const { authorization } = req.headers;
    const AccessToken = await AuthUtils.GetAccessToken(authorization);
    const RefreshToken = await AuthUtils.GetRefreshToken(req.signedCookies, 'REFRESH_TOKEN');
    const accessTokenData = await JWT.decode(AccessToken);
    if (!accessTokenData?.sub && !accessTokenData?.accessTokenKey)
        throw new AuthenticationFailureError('Invalid access Token!');

    const user = await userRepository.FindById(accessTokenData.sub);
    if (!user) throw new AuthenticationFailureError('user is not registered!');
    const refreshTokenData = await JWT.decode(RefreshToken);
    if (!refreshTokenData?.sub && !refreshTokenData?.refreshTokenKey)
        throw new AuthenticationFailureError('Invalid refresh Token!');
    if (refreshTokenData.sub !== accessTokenData.sub)
        throw new AuthenticationFailureError('Invalid token');
    const keystore = await keyStoreRepository.FindOne({
        user: user._id,
        primaryKey: accessTokenData.accessTokenKey,
        secondaryKey: refreshTokenData.refreshTokenKey,
    });
    if (!keystore) throw new AuthenticationFailureError('Invalid access token');
    await keyStoreRepository.DeleteOne(keystore._id);
    const newKeystore = await keyStoreRepository.Create(user._id);
    const { accessToken, refreshToken } = await AuthUtils.CreateTokens(
        user._id,
        newKeystore.primaryKey,
        newKeystore.secondaryKey
    );
    new ApiResponse(res)
        .sendCookie('REFRESH_TOKEN', refreshTokenExpiry, refreshToken)
        .status(200)
        .data({ accessToken })
        .send();
};

const verifyAccount = async (req, res, next) => {
    const { token } = req.params;
    const userToken = await tokenRepository.FindOne({ token: token });
    if (!userToken) throw new BadRequestError('your token is Invalid or it may expired.');

    const user = await userRepository.FindOne({ _id: userToken?.userId });
    if (user?.verified) throw new BadRequestError('User already verified!');
    await userRepository.SetData({ _id: user?._id }, { verified: true });
    new ApiResponse(res).msg('Account Verified.').send();
};

const resendVerificationToken = async (req, res, next) => {
    const { email } = req.body;
    const user = await userRepository.FindOne({ email });
    if (!user)
        throw new AuthenticationFailureError(
            'The email address is not associated with any account'
        );

    if (user?.verified) throw new BadRequestError('Account is already verified!');
    const token = await tokenRepository.Create(user?._id);
    await AuthUtils.SendVerificationEmail(user, token);
    new ApiResponse(res).msg('Verification token sended to your email.').send();
};

const changePassword = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const { password, salt, _id } = req.user;
    const { hashedPassword, salt: Salt } = await AuthUtils.GeneratePassword(newPassword);

    const validateOldPass = await AuthUtils.ValidatePassword(oldPassword, password, salt);
    if (!validateOldPass) throw new BadRequestError('Old password doesnt mathched.');

    await userRepository.SetData({ _id }, { password: hashedPassword, Salt });
    new ApiResponse(res).msg('Password change successful.').send();
};

const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    const user = await userRepository.FindOne({ email });
    if (!user) throw new BadRequestError('This email is not associated with any account!');
    const duplicate = await otpRepository.FindOne({ user: email });
    if (duplicate) await otpRepository.DeleteOne({ _id: duplicate._id });
    const { otp } = await otpRepository.Create(email);
    await AuthUtils.Send2FAMail(user, otp);
    new ApiResponse(res)
        .data({ token: otpDoc._id })
        .msg('An otp has been sended to your email. It will expire in 10 minutes.')
        .send();
};

const validateOtp = async (req, res, next) => {
    const { otp } = req.body;
    const { token } = req.params;
    const otpDoc = await otpRepository.FindOne({ _id: token });
    if (!otpDoc) throw new BadRequestError('Invalid token.');
    if (otp?.toUpperCase().toString() !== otpDoc?.otp?.toUpperCase().toString())
        throw new BadRequestError('Invalid otp');
    const verifiedOtp = await otpRepository.SetData({ _id: token }, { verified: true });
    new ApiResponse(res).data({ token: verifiedOtp._id }).msg('otp validate successful').send();
};

const resetPassword = async (req, res, next) => {
    const { password } = req.body;
    const { token } = req.params;
    const otpDoc = await otpRepository.FindOne({ _id: token });
    if (!otpDoc && !otpDoc?.verified) throw new AuthorizationFailureError('Permission denied');
    const user = await userRepository.FindOne({ email: otpDoc?.email });
    const { hashedPassword, salt } = await AuthUtils.GeneratePassword(password);
    await userRepository.SetData({ _id: user?._id }, { password: hashedPassword, salt });
    await otpRepository.DeleteOne({ _id: token });
    new ApiResponse(res).msg('Password reset successful!').send();
};

module.exports = {
    signUp,
    signIn,
    signOut,
    tokenRefresh,
    verifyAccount,
    resendVerificationToken,
    changePassword,
    forgotPassword,
    resetPassword,
    validateOtp,
};
