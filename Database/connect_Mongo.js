const mongoose = require('mongoose')

const Connect_Mongo = (URL) =>{
    mongoose.connect(URL)
            .then(()=> console.log("Connected Successfully MongoDB"))
            .catch((err) =>{ console.log(err)
                    setTimeout(Connect_Mongo(URL), 5000)
            }
        )
}

module.exports = Connect_Mongo