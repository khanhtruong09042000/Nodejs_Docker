const nodemailer = require('nodemailer')
const configMail = require('./configMail')

const sendMail = async({to, subject, html}) =>{
    const transporter = nodemailer.createTransport(configMail)

    return transporter.sendMail({
        from: '"Admin" <Admin@gmail.com',
        to,
        subject,
        html
    })
}

module.exports = sendMail