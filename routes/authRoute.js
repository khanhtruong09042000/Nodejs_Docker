const express = require('express')
const router = express.Router()

const {
    Login,
    Register,
    Logout
} = require('../controllers/authController')

const { authenticateUser } = require('../middleware/authentication')

router.post('/register', Register)
router.post('/login', Login)
router.delete('/logout', authenticateUser, Logout)

module.exports = router