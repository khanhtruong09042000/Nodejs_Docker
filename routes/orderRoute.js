const express = require('express')
const router = express.Router()
const {
    authenticateUser,
    authorizePermissions
} = require('../middleware/authentication')

const {
    createOrder,
    getAllOrders,
    getOrder,
    getMyOrder,
    updateOrder
} = require('../controllers/orderController')

router.route('/').post(authenticateUser, createOrder)
                .get(authenticateUser, authorizePermissions('admin'), getAllOrders)

router.route('/showMyOrders').get(authenticateUser, getMyOrder)

router.route('/:id').get(authenticateUser, getOrder)
                    .patch(authenticateUser, updateOrder)

module.exports = router