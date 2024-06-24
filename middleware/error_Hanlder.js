const {StatusCodes} = require('http-status-codes')

const errorHanlder = (err, req, res, next) => {
    let customError = {
        statusCode : err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Server down!'
    }

    return res.status(customError.statusCode).json({msg: customError.msg})
}

module.exports = errorHanlder