const { AuthorizationFailureError } = require('../helpers/AppError')
const verifyRole =
    (...acceptedRoles) =>
    async (req, res, next) => {
        try {
            if (!req.user?.roles) throw new AuthorizationFailureError('Permission denied')
            const exists = req.user.roles
                .map((role) => acceptedRoles.includes(role))
                .find((val) => val === true)
            if (!exists) throw new AuthorizationFailureError('Permission denied!')
            next()
        } catch {
            next(new AuthorizationFailureError('Permission denied!'))
        }
    }

module.exports = {
    verifyRole,
}
