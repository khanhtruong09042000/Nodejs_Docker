const express = require('express')
const router = express.Router()
const {
    authenticateUser,
    authorizePermissions
} = require('../middleware/authentication')

const {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    uploadImage
} = require('../controllers/productController')

router.route('/').post([authenticateUser, authorizePermissions('admin')], createProduct)
                .get(getAllProducts)
router.route('/:id').get(getProduct)
                    .patch([authenticateUser, authorizePermissions('admin')], updateProduct)
router.route('/uploadImage').post([authenticateUser, authorizePermissions('admin')], uploadImage)

module.exports = router