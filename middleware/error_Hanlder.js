const {StatusCodes} = require('http-status-codes')

const errorHanlder = (err, req, res, next) => {
    let customError = {
        statusCode : err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Server down!'
    }
    
    if(err.name === 'CastError'){
        customError.statusCode = 404
        customError.msg = `Not found id: ${err.value}`
    }

    return res.status(customError.statusCode).json({msg: customError.msg})
}

module.exports = errorHanlder