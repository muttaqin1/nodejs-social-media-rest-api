const {
    AppError: { NotFoundError },
} = require('../helpers');
const { ApiResponse } = require('../helpers');
const errorHandler = (err, req, res, next) => {
    if (res.headerSent) return next(err);

    console.log(err);
    const status = err.statusCode || 500;
    new ApiResponse(res).status(status).msg(err.message).send();
};

const notFound = (req, res, next) => next(new NotFoundError());

module.exports = [notFound, errorHandler];
