const User = require('../models/userModel')
const CustomError = require('../errors')
const {StatusCodes} = require('http-status-codes')

const Register = async(req, res) => {
    const {name, email, password} = req.body;
    const emailExisted = await User.findOne({email})
    if(emailExisted){
        throw new CustomError.BadRequest('Email is existed!')
    }

    // const isFirstAccount = (await User.countDocuments({})) === 0
    // const role = isFirstAccount ? 'admin' : 'user'
    const newUser = await User.create({ 
        name, email, password
    })

    res.status(StatusCodes.CREATED).json({
        status: "201",
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