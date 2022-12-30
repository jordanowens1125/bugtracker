const mongoose = require('mongoose')
const User = require('./models/user')
const Project = require('./models/project')
const Bug = require('./models/bug')
const Comment = require('./models/comment')
require('dotenv').config({path:'./config/.env'})
const connectDB = require('./config/db')
const seedProjects = require('./seedFolder/projects')
const seedUsers = require('./seedFolder/users')
const seedBugs = require('./seedFolder/bugs')
const seedComments = require('./seedFolder/comments')
connectDB()

const seedDB= async()=>{
    try{
        await User.deleteMany({})
        await User.insertMany(seedUsers)

        await Bug.deleteMany({})
        await Bug.insertMany(seedBugs)

        await Comment.deleteMany({})
        await Comment.insertMany(seedComments)
        
        await Project.deleteMany({})
        await Project.insertMany(seedProjects) 

    }catch(err){
        console.log(err)
    }
    
}

seedDB().then(()=>{
    mongoose.connection.close()
})