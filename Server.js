const express = require("express")
require('dotenv').config()

const Connect_Mongo = require('./Database/connect_Mongo')
const authRouter = require('./routes/authRoute')

const app = express()

const port = process.env.PORT || 5000

app.use(express.json())

app.use('/api/v1/auth', authRouter)

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