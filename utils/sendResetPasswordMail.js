const sendMail = require("./sendMail")

const sendResetPasswordMail = async({name, email, token, origin}) =>{
    const URL = `${origin}/user/reset-password?token=${token}&email=${email}`

    const message = `<p>Please reset password by clicking on the following link :   <a href="${URL}">Verify Email</a> </p>`

    return sendMail({
        to: email,
        subject: 'Reset Password',
        html: `<h4> Hello ${name} </h4> ${message}`
    })
}

module.exports = sendResetPasswordMail