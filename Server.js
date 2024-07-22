require('dotenv').config()
require('express-async-errors')

const express = require("express")
const cookieParser = require('cookie-parser')
const helmet = require('helmet')

const Connect_Mongo = require('./Database/connect_Mongo')

const notFound = require('./middleware/not_Found')
const errorHanlder = require('./middleware/error_Hanlder')

const authRouter = require('./routes/authRoute')
const userRouter = require('./routes/userRoute')

const app = express()

app.use(cookieParser(process.env.JWT_SECRET))
app.use(helmet())

const port = process.env.PORT || 5000

app.use(express.json())

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)

app.use(notFound)
app.use(errorHanlder) 

const Start = async () => {
    try {
        await Connect_Mongo(process.env.URL)
        app.listen(port, ()=>{
            console.log(`Server is running port: ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

Start()