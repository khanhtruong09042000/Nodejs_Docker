const User = require('../models/userModel')
const CustomError = require('../errors')
const {StatusCodes} = require('http-status-codes')
const crypto = require('crypto')

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

}

module.exports = {
    Login,
    Register
}