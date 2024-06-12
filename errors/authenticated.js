const CustomAPIError = require('./custom_error')
const {StatusCodes} = require('http-status-codes')

class Authenticadted extends CustomAPIError{
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
}

module.exports = Authenticadted