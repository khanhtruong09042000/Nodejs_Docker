const Product = require('../models/productModel')
const CustomError = require('../errors')
const {StatusCodes} = require('http-status-codes')
const path = require('path')

const createProduct = async(req,res) =>{
    req.body.user = req.user.userId
    const product = await Product.create(req.body)
    res.status(StatusCodes.CREATED).json({product})
}

const getAllProducts = async(req,res) =>{
    const products = await Product.find()
    res.status(StatusCodes.OK).json({products, count: products.length})
}

const getProduct = async(req,res) =>{
    const {id} = req.params
    const product = await Product.findOne({_id: id})
    if(!product){
        throw new CustomError.NotFound(`No product with id: ${id}`)
    }
    res.status(StatusCodes.OK).json({product})
}

const updateProduct = async(req,res) =>{
    const {id} = req.params
    const product = await Product.findOneAndUpdate({_id: id}, req.body, {
        new:true,
        runValidators: true
    })
    if(!product){
        throw new CustomError.NotFound(`No product with id: ${id}`)
    }
    res.status(StatusCodes.OK).json({product})
}

const deleteProduct = async(req,res) =>{
    const {id} = req.params
    const product = await Product.findOne({_id: id})
    if(!product){
        throw new CustomError.NotFound(`No product with id: ${id}`)
    }
    await product.deleteOne()
    res.status(StatusCodes.OK).json('Product removed successfully!')
}

const uploadImage = async(req,res) =>{
    if(!req.files){
        throw new CustomError.BadRequest('No file Upload!')
    }
    const productImage = req.files.image
    if(!productImage.mimetype.startsWith('image')){
        throw new CustomError.BadRequest('Please upload image!')
    }

    const maxSize = 2 * 1024 * 1024
    if(productImage.size > maxSize){
        throw new CustomError.BadRequest('Please upload image smaller than 2MB!')
    }

    const imagePath = path.join(__dirname, '../public/uploads/' + `${productImage.name}`)
    await productImage.mv(imagePath)
    res.status(StatusCodes.OK).json({image: `uploads/${productImage.name}`})
}

module.exports = {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    uploadImage,
    deleteProduct
}