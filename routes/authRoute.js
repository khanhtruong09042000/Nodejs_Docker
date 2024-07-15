const express = require('express')
const router = express.Router()

const {
    Login,
    Register,
    verifyEmail,
    Logout, 
    ForgotPassword,
    ResetPassword
} = require('../controllers/authController')

const { authenticateUser } = require('../middleware/authentication')

router.post('/register', Register)
router.post('/verify-email', verifyEmail)
router.post('/login', Login)
router.delete('/logout', authenticateUser, Logout)
router.post('/forgot-password', ForgotPassword)
router.post('/reset-password', ResetPassword)

module.exports = router