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
    createHash,
    sendVerifiedMail,
    sendResetPasswordMail
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

    const origin = process.env.HOST_NAME
    await sendVerifiedMail({
        name: newUser.name,
        email: newUser.email,
        verificationToken: newUser.verificationToken,
        origin
    })

    res.status(StatusCodes.CREATED).json({
        msg : "Success, created account!",
        user: newUser
    })
}

const verifyEmail = async(req,res)=>{
    const {verificationToken, email} = req.body
    const user = await User.findOne({email})
    if(!user){
        throw new CustomError.BadRequest('Verified Fail!')
    }
    if(user.verificationToken !== verificationToken){
        throw new CustomError.BadRequest('Verified Fail!')
    }
    user.verified = new Date()
    user.isVerified = true
    user.verificationToken = ''

    await user.save()
    res.status(StatusCodes.OK).json({msg:"Email verified!"})
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

const Logout = async(req,res) =>{
    await Token.findOneAndDelete({user: req.user.userId})

    res.cookie('accessToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now())
    })

    res.cookie('refreshToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now())
    })
    res.status(StatusCodes.OK).json({msg: 'Logout Successfull!'})
}

const ForgotPassword = async(req,res) =>{
    const {email} = req.body
    if(!email){
        throw new CustomError.BadRequest('Please provide valid email!')
    }

    const user = await User.findOne({email})
    if(user){
        const passwordToken = crypto.randomBytes(70).toString('hex')
        const origin = process.env.HOST_NAME
        await sendResetPasswordMail({
            name: newUser.name,
            email: newUser.email,
            token: passwordToken,
            origin
        })

        const tenMinutes = 1000 * 60 * 10
        const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes)

        user.passwordToken = createHash(passwordToken)
        user.passwordTokenExpirationDate = passwordTokenExpirationDate
        await user.save()
    }
    res.status(StatusCodes.OK).json({msg: "Please check your email!"})
}

const ResetPassword = async(req,res) =>{
    const {token, email, password} = req.body
    if(!token || !email || !password){
        throw new CustomError.BadRequest('Please provide all values!')
    }
    const user = await User.findOne({email})
    if(user){
        const currentDate = new Date()
        if(user.passwordToken === createHash(token) && user.passwordTokenExpirationDate > currentDate ){
            user.password = password
            user.passwordToken = null
            user.passwordTokenExpirationDate = null
        }
        await user.save()
    }
    res.send('Reset password!')
}

module.exports = {
    Login,
    Register,
    verifyEmail,
    Logout, 
    ForgotPassword,
    ResetPassword
}