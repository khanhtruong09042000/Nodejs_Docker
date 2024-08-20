const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const stripeAPI = async ({totalAmount})=>{
    const session = await stripe.paymentIntents.create({
        amount: totalAmount,
        currency: process.env.CURRENCY,
        automatic_payment_methods: {
            enabled: true,
        },
    })
    return session
}

module.exports = stripeAPI