const CustomAPIError = require('./custom_error')
const {StatusCodes} = require('http-status-codes')

class Authorized extends CustomAPIError{
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.FORBIDDEN
    }
}

module.exports = Authorized