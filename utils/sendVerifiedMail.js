const sendMail = require("./sendMail")

const sendVerifiedMail = async({name, email, verificationToken, origin}) =>{
    const verifiedEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`

    const message = `<p>Please confirm your email by clicking on the following link :   <a href="${verifiedEmail}">Verify Email</a> </p>`

    return sendMail({
        to: email,
        subject: 'Email confirmation',
        html: `<h4> Hello ${name} </h4> ${message}`
    })
}

module.exports = sendVerifiedMail