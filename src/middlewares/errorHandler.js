const {
    AppError: { NotFoundError },
} = require('../helpers')
const errorHandler = (err, req, res, next) => {
    if (res.headerSent) return next(err)

    console.log(err)
    res.status(500).json({
        success: false,
        statusCode: err.statusCode,
        message: err.message,
    })
}

const notFound = (req, res, next) => next(new NotFoundError())

module.exports = [notFound, errorHandler]
