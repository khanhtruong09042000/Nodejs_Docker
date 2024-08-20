const {createJWT, isTokenValid, attachCookiesToRespose} = require('./jwt')
const createTokenUser = require('./createTokenUser')
const createHash = require('./createHash')
const sendVerifiedMail = require('./sendVerifiedMail')
const sendResetPasswordMail = require('./sendResetPasswordMail')
const checkPermissions = require('./checkPermissions')
const stripeAPI = require('./stripeAPI')

module.exports = {
    createJWT,
    isTokenValid,
    attachCookiesToRespose,
    createTokenUser,
    createHash,
    sendVerifiedMail,
    sendResetPasswordMail,
    checkPermissions,
    stripeAPI
}
