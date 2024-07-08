module.exports = {
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: process.env.USER_MAIL,
        pass: process.env.PASS_MAIL
    }
}