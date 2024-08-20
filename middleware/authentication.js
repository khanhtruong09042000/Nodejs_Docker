const CustomAPIError = require("../errors")
const Token = require("../models/tokenModel")
const { isTokenValid, attachCookiesToRespose } = require("../utils")

const authenticateUser = async(req, res, next) =>{
    const {refreshToken, accessToken} = req.signedCookies

    try {
        if(accessToken){
            const payload = isTokenValid(accessToken)
            req.user = payload.user
            return next()
        }
        const payload = isTokenValid(refreshToken)

        const existingToken = await Token.findOne({
            user: payload.user,
            refreshToken: payload.refreshToken
        })
        if(!existingToken || !existingToken?.isValid){
            throw new CustomAPIError.Authenticadted("Authenticated Invalid!")
        }

        attachCookiesToRespose({res, user: payload.user, refreshToken: payload.refreshToken})
        req.user = payload.user
        next()
    } catch (error) {
        throw new CustomAPIError.Authenticadted("Authenticated Invalid Error!")
    }
}

const authorizePermissions = (...roles) =>{
    return (req,res,next) =>{
        if(!roles.includes(req.user.role)){
            throw new CustomAPIError.Authorized('Unauthorized to access this route')
        }
        next()
    }
}

module.exports = {
    authenticateUser,
    authorizePermissions
}