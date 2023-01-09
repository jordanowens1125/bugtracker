const mongoose = require('mongoose');
require('dotenv').config()
const DB_STRING = process.env.DB_STRING
const  connectDB = async ()=>{
    try{
        const  db = await mongoose.connect(DB_STRING);
        console.log(`MongoDB Connected: ${db.connection.host}`)
    }catch(err){
        console.log(err)
        process.exit(1)
    }
} 

module.exports= connectDB