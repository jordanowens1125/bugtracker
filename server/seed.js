const mongoose = require('mongoose')
const User = require('./models/user')
require('dotenv').config({path:'./config/.env'})
const connectDB = require('./config/db')
connectDB()


const seedUsers=[
    {
        email:'hllam@live.com',
    },
    {
        email:'jadavis@verizon.net',
    },
    {
        email:'flaviog@msn.com',
    },
    {
        email:'lenz@sbcglobal.net',
    },
    {
        email:'glenz@sbcglobal.net',
    },
    {
        email:'durist@comcast.net',
    },
    {
        email:'stomv@hotmail.com',
    },
    {
        email:'mschwartz@sbcglobal.net',
    },
    {
        email:'bryanw@hotmail.com',
    },
    {
        email:'chaikin@aol.com',
    },
    {
        email:'phish@verizon.net',
    },
    {
        email:'jramio@msn.com',
    },
    {
        email:'pakaste@yahoo.ca',
    },
    {
        email:'am@live.com',
    },
    {
        email:'hll21232am@live.com',
    },
]

const seedDB= async()=>{
    await User.insertMany(seedUsers)
}

seedDB().then(()=>{
    mongoose.connection.close()
})