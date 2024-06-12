const express = require('express')
const router = express.Router()

const {
    Login,
    Register
} = require('../controllers/authController')

router.post('/register', Register)

module.exports = router