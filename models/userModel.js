const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        validate: {
            validator: validator.isEmail,
            message: 'Please provide valid email'  
        }
    },
    password: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    verificationToken: String
})

userSchema.pre('save', async function(){
    if(!this.isModified('password')) return
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.comparePassword = async function (password){
    const isCorrect = await bcrypt.compare(password, this.password)
    return isCorrect
}

module.exports = mongoose.model('User', userSchema)
