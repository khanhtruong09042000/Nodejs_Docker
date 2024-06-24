const CustomAPIError = require('./custom_error')
const BadRequest = require('./bad_Request')
const NotFound = require('./not_Found')
const Authenticadted = require('./authenticated')
const Authorized = require('./authorized')

module.exports = {
    CustomAPIError,
    BadRequest,
    NotFound,
    Authenticadted,
    Authorized
}