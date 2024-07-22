const express = require('express')
const router = express.Router()
const {
    authenticateUser,
    authorizePermissions
} = require('../middleware/authentication')
const {
    getListUsers,
    getUser,
    showCurrentUser,
    updateUser,
    updatePassword
} = require('../controllers/userController')

router.route('/').get(authenticateUser, authorizePermissions('admin'), getListUsers)
router.route('/showMe').get(authenticateUser, showCurrentUser)
router.route('/updateUser').patch(authenticateUser,updateUser)
router.route('/updatePassword').patch(authenticateUser, updatePassword)
router.route('/:id').get(authenticateUser, getUser)

module.exports = router