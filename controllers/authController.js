const User = require('../models/userModel')
const Token = require('../models/tokenModel')
const CustomError = require('../errors')
const {StatusCodes} = require('http-status-codes')
const crypto = require('crypto')
const {
    createJWT,
    isTokenValid,
    attachCookiesToRespose,
    createTokenUser,
    createHash
} = require('../utils')

const Register = async(req, res) => {
    const {name, email, password} = req.body;
    const emailExisted = await User.findOne({email})
    if(emailExisted){
        throw new CustomError.BadRequest('Email is existed!')
    }

    const isFirstAccount = (await User.countDocuments({})) === 0
    const role = isFirstAccount ? 'admin' : 'user'
    const verificationToken = crypto.randomBytes(40).toString('hex')

    const newUser = await User.create({ 
        name, email, password, role, verificationToken
    })

    res.status(StatusCodes.CREATED).json({
        msg : "Success, created account!",
        user: newUser
    })
}

const Login = async(req, res) => {
    const {email, password} = req.body
    if(!email || !password){
        throw new CustomError.BadRequest("Please provide email and password!")
    }

    const user = await User.findOne({email})
    if(!user){
        throw new CustomError.Authenticadted("Invalid Credentinals!")
    }

    const isCorrectPassword = await user.comparePassword(password)
    if(!isCorrectPassword){
        throw new CustomError.Authenticadted("Invalid Credentinals!")
    }

    const tokenUser = createTokenUser(user)
    
    let refreshToken = ''
    const existingToken = await Token.findOne({user: user._id})
    if(existingToken){
        const {isValid} = existingToken
        if(!isValid){
            throw new CustomError.Authenticadted('Invalid Credentials!')
        }
        refreshToken = existingToken.refreshToken
        attachCookiesToRespose({res, user: tokenUser, refreshToken})
        res.status(StatusCodes.OK).json({user: tokenUser})
        return
    }

    refreshToken = crypto.randomBytes(40).toString('hex')
    const userAgent = req.headers['user-agent']
    const ip = req.ip
    const userToken = {refreshToken, ip, userAgent, user: user._id}
    await Token.create(userToken)

    attachCookiesToRespose({res, user: tokenUser, refreshToken})

    res.status(StatusCodes.OK).json({user: tokenUser})
}

module.exports = {
    Login,
    Register
}