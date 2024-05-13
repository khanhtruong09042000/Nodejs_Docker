const express = require("express")
require('dotenv').config()

const Connect_Mongo = require('./Database/connect_Mongo')

const app = express()

const port = process.env.PORT || 5000

app.use("/", (req,res) =>{
    res.send("Hello")
})

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