require('dotenv').config()
require('express-async-errors')

const express = require("express")
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const fileUpload = require('express-fileupload')
const morgan = require('morgan')
const cors = require('cors')
const rateLimiter = require('express-rate-limit')
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')

const Connect_Mongo = require('./Database/connect_Mongo')

const notFound = require('./middleware/not_Found')
const errorHanlder = require('./middleware/error_Hanlder')

const authRouter = require('./routes/authRoute')
const userRouter = require('./routes/userRoute')
const productRouter = require('./routes/productRoute')
const reviewRouter = require('./routes/reviewRoute')
const orderRouter = require('./routes/orderRoute')

const app = express()

app.set('trust proxy', 1)
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60
}))
app.use(cookieParser(process.env.JWT_SECRET))
app.use(helmet())
app.use(fileUpload())
app.use(morgan('common'))
app.use(cors())
app.use(xss())
app.use(mongoSanitize())
app.use(express.static('./public'))

const port = process.env.PORT || 5000

app.use(express.json())

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/product', productRouter)
app.use('/api/v1/review', reviewRouter)
app.use('/api/v1/order', orderRouter)

app.use(notFound)
app.use(errorHanlder) 

const Start = async () => {
    try {
        await Connect_Mongo(process.env.URL_MONGO)
        app.listen(port, ()=>{
            console.log(`Server is running port: ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

Start()