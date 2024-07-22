const User = require('../models/userModel')
const CustomError = require('../errors')
const {StatusCodes} = require('http-status-codes')
const {
    createJWT,
    isTokenValid,
    attachCookiesToRespose,
    createTokenUser,
    createHash,
    sendVerifiedMail,
    sendResetPasswordMail,
    checkPermissions
} = require('../utils')

const getListUsers = async(req, res) =>{
    const listUsers = await User.find({role: 'user'}).select('-password')
    res.status(StatusCodes.OK).json({listUsers})
}

const getUser = async(req,res) =>{
    const user = await User.findOne({_id: req.params.id}).select('-password')
    if(!user){
        throw new CustomError.NotFound(`No user id: ${req.params.id}`)
    }
    checkPermissions(req.user,user._id)
    res.status(StatusCodes.OK).json({user})
}

const showCurrentUser = async(req, res) =>{
    res.status(StatusCodes.OK).json({user: req.user})
}

const updateUser = async(req,res) =>{
    const {email, name} = req.body
    if(!email || !name){
        throw new CustomError.BadRequest('Please provide all values!')
    }
    const user = await User.findOne({_id: req.user.userId})
    user.email = email
    user.name = name
    await user.save()

    const tokenUser = createTokenUser(user)
    attachCookiesToRespose({res,user:tokenUser})
    res.status(StatusCodes.OK).json({user: tokenUser})
}

const updatePassword = async(req,res)=>{
    const {oldPassword, newPassword} = req.body
    if(!oldPassword || !newPassword){
        throw new CustomError.BadRequest('Please provide all values!')
    }
    const user = await User.findOne({_id: req.user.userId})
    const isPassword = await user.comparePassword(oldPassword)
    if(!isPassword){
        throw new CustomError.Authenticadted('Invalid Credentials')
    }
    user.password = newPassword
    await user.save()
    res.status(StatusCodes.OK).json({msq:'Update password successfull!'})
}

module.exports = {
    getListUsers,
    getUser,
    showCurrentUser,
    updateUser,
    updatePassword
}