require('dotenv').config()
require('express-async-errors')

const express = require("express")

const Connect_Mongo = require('./Database/connect_Mongo')

const notFound = require('./middleware/not_Found')
const errorHanlder = require('./middleware/error_Hanlder')

const authRouter = require('./routes/authRoute')

const app = express()

const port = process.env.PORT || 5000

app.use(express.json())

app.use('/api/v1/auth', authRouter)

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