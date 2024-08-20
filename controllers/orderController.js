const Order = require('../models/orderModel')
const Product = require('../models/productModel')
const CustomError = require('../errors')
const {StatusCodes} = require('http-status-codes')
const { checkPermissions, stripeAPI } = require('../utils')

const createOrder = async(req,res) =>{
    const {items: tax, shippingFee, cartItems} = req.body
    if(!cartItems || cartItems.length < 1){
        throw new CustomError.BadRequest('No cart items provied!')
    }
    if(!tax || !shippingFee){
        throw new CustomError.BadRequest('Please provided tax and shippingfee!')
    }
    
    let orderItems = []
    let subtotal = 0

    for(const item of cartItems){
        const dbProduct = await Product.findOne({_id: item.product})
        if(!dbProduct){
            throw new CustomError.NotFound(`No item product id : ${item.product}`)
        }
        const {name, price, image, _id} = dbProduct
        const orderItem = {
            amount: item.amount,
            name,
            price,
            image,
            product: _id
        } 
        orderItems = [...orderItems, orderItem]
        subtotal += item.amount * price 
    }
    const total = tax + shippingFee + subtotal
    const paymentIntents = await stripeAPI({totalAmount: total})

    const order = await Order.create({
        orderItems,
        total,
        subtotal,
        tax,
        shippingFee,
        clientSecret: paymentIntents.clientSecret,
        user: req.user.userId
    })
    
    res.status(StatusCodes.CREATED).json({order, clientSecret: order.clientSecret})
}

const getAllOrders = async(req, res)=>{
    const orders = await Order.find()
    res.status(StatusCodes.OK).json({orders, count: orders.length})
}

const getOrder = async (req,res)=>{
    const {id: orderId} = req.params
    const order = await Order.findOne({_id: orderId})
    if(!order){
        throw new CustomError.NotFound(`No order id: ${orderId}`)
    }
    checkPermissions(req.user, order.user)
    res.status(StatusCodes.OK).json({order})
}

const getMyOrder = async (req,res)=>{
    const order = await Order.find({user: req.user.userId})
    res.status(StatusCodes.OK).json({order, count: order.length})
}

const updateOrder = async (req,res)=>{
    const {id: orderId} = req.params
    const {paymentIntentId} = req.body
    const order = await Order.findOne({_id: orderId})
    if(!order){
        throw new CustomError.NotFound(`No order id: ${orderId}`)
    }
    checkPermissions(req.user, order.user)

    order.paymentIntentId = paymentIntentId
    order.status = 'paid'
    await order.save()

    res.status(StatusCodes.OK).json({order})
}

module.exports = {
    createOrder,
    getAllOrders,
    getOrder,
    getMyOrder,
    updateOrder
}