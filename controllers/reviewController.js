const Review = require('../models/reviewModel')
const Product = require('../models/productModel')
const CustomError = require('../errors')
const {StatusCodes} = require('http-status-codes')
const { checkPermissions } = require('../utils')

const createReview = async(req,res) =>{
    const {product: productId} = req.body
    const isValidProduct = await Product.findOne({_id: productId})
    if(!isValidProduct){
        throw new CustomError.BadRequest(`Not found id: ${productId}`)
    }

    const isSubmitted = await Review.findOne({
        product: productId,
        user: req.user.userId
    })
    if(isSubmitted){
        throw new CustomError.BadRequest('You were submitted!')
    }

    req.body.user = req.user.userId
    const review = await Review.create(req.body)
    res.status(StatusCodes.CREATED).json({review})
}

const getAllReviews = async(req, res)=>{
    const allReviews = await Review.find().populate({
        path: 'product',
        select: 'name price company'
    })
    res.status(StatusCodes.OK).json({allReviews, count: allReviews.length})
}

const getReview = async(req,res) =>{
    const {id: reviewId} = req.params
    const review = await Review.findOne({_id: reviewId})
    if(!review){
        throw new CustomError.BadRequest(`Not found review id: ${reviewId}`)
    }
    res.status(StatusCodes.OK).json({review})
}

const updateReview = async(req,res)=>{
    const {id: reviewId} = req.params
    const {rating, title, comment} = req.body
    const review = await Review.findOne({_id: reviewId})
    if(!review){
        throw new CustomError.BadRequest(`Not found review id: ${reviewId}`)
    }
    checkPermissions(req.user, review.user)
    review.rating = rating
    review.title = title
    review.comment = comment

    await review.save()
    res.status(StatusCodes.OK).json({review})
}

const deleteReview = async(req,res)=>{
    const {id: reviewId} = req.params
    const review = await Review.findOne({_id: reviewId})
    if(!review){
        throw new CustomError.BadRequest(`Not found review id: ${reviewId}`)
    }
    checkPermissions(req.user, review.user)

    await review.deleteOne()
    res.status(StatusCodes.OK).json('Review removed successfully!')
}

const getSingleProductReviews = async (req,res)=>{
    const {id: productId} = req.params
    const reviews = await Review.find({product: productId})
    res.status(StatusCodes.OK).json({reviews, count: reviews.length})
}

module.exports = {
    createReview,
    getAllReviews,
    getReview,
    updateReview,
    deleteReview,
    getSingleProductReviews
}