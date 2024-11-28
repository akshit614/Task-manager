require("dotenv").config({
    path : '.env'
})

const mongoose = require("mongoose")

const connectDb = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Database connected successfully")
        
    } catch (error) {
        console.error("Error while connecting to database ", error)
        
    }
}

module.exports = connectDb