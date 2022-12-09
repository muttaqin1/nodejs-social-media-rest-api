const statusCodes = {
    OK: 200,
    BAD_REQUEST: 400,
    UN_AUTHORISED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
}
//base error class
class BaseError extends Error {
    constructor(name, statusCode, description, isOperational, errorStack, logingErrorResponse) {
        super(description)
        Object.setPrototypeOf(this, new.target.prototype)
        this.name = name
        this.statusCode = statusCode
        this.isOperational = isOperational
        this.errorStack = errorStack
        this.logError = logingErrorResponse
        Error.captureStackTrace(this)
    }
}
//500
class ApiError extends BaseError {
    constructor(description = 'Internal server error!') {
        super('API ERROR', statusCodes.INTERNAL_ERROR, description, true)
    }
}

//400
class BadRequestError extends BaseError {
    constructor(description = 'Bad request') {
        super('BAD REQUEST', statusCodes.BAD_REQUEST, description, true)
    }
}

class BadTokenError extends BaseError {
    constructor(description = 'Bad token') {
        super('BadTokenError', statusCodes.UN_AUTHORISED, description, true)
    }
}

class TokenExpiredError extends BaseError {
    constructor(description = 'Token is expired!') {
        super('TokenExpiredError', statusCodes.UN_AUTHORISED, description, true)
    }
}

class NotFoundError extends BaseError {
    constructor(description = '404 Not Found!') {
        super('NotFoundError', statusCodes.NOT_FOUND, description, true)
    }
}

class AuthenticationFailureError extends BaseError {
    constructor(description = 'Authentication Failure!') {
        super('AuthenticationFailureError', statusCodes.UN_AUTHORISED, description, true)
    }
}

class AuthorizationFailureError extends BaseError {
    constructor(description = 'Permission denied!') {
        super('AuthorizationFailureError', statusCodes.UN_AUTHORISED, description, true)
    }
}
class ForbiddenError extends BaseError {
    constructor(description = 'Forbidden!') {
        super('FORBIDDEN', statusCodes.FORBIDDEN, description, true)
    }
}

module.exports = {
    ApiError,
    BadRequestError,
    AuthenticationFailureError,
    AuthorizationFailureError,
    NotFoundError,
    BadTokenError,
    TokenExpiredError,
    ForbiddenError,
}
