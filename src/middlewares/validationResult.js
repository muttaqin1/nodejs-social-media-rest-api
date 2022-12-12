const { validationResult } = require('express-validator');
const { ApiResponse } = require('../helpers');
const result = (req, res, next) => {
    const error = validationResult(req).formatWith(({ msg }) => msg);
    if (Object.keys(error.mapped()).length > 0)
        return new ApiResponse(res)
            .status(400)
            .data({ ...error.mapped() })
            .send();
    next();
};

module.exports = result;
