const mongoose = require('mongoose')
const User = require('../models/user')

const seedUsers=[
    new User({
        _id:mongoose.Types.ObjectId('63a36a4d3f0f5cf676acf07c'),
        email:'hllam@live.com',
        project:["63ab7ace4e39c16c9b79e3ac"],
        assignedBugs:['63ab78cc81174e7f3a98fd0e'],
        comments:[],
    }),
    new User({
        _id:mongoose.Types.ObjectId('63a36a4d3f0f5cf676acf07d'),
        email:'jadavis@verizon.net',
        project:["63ab7ace4e39c16c9b79e3ac"],
        comments:[],
        assignedBugs:[],
    }),
    new User({
        _id:mongoose.Types.ObjectId('63a36a4d3f0f5cf676acf07e'),
        email:'flaviog@msn.com',
        project:["63ab7ace4e39c16c9b79e3ac"],
        comments:[],
        assignedBugs:[],
    }),
    new User({
        _id:mongoose.Types.ObjectId('63a36a4d3f0f5cf676acf07f'),
        email:'lenz@sbcglobal.net',

        comments:[],
        assignedBugs:[],
    }),
    new User({
        _id:mongoose.Types.ObjectId('63a36a4d3f0f5cf676acf080'),
        email:'glenz@sbcglobal.net',

        comments:[],
        assignedBugs:[],
    }),
    new User({
        _id:mongoose.Types.ObjectId('63a36a4d3f0f5cf676acf081'),
        email:'durist@comcast.net',

        comments:[],
        assignedBugs:[],
    }),
    new User({
        _id:mongoose.Types.ObjectId('63a36a4d3f0f5cf676acf082'),
        email:'stomv@hotmail.com',

        comments:[],
        assignedBugs:[],
    }),
    new User({
        _id:mongoose.Types.ObjectId('63a36a4d3f0f5cf676acf083'),
        email:'mschwartz@sbcglobal.net',

        comments:[],
        assignedBugs:[],
    }),
    new User({
        _id:mongoose.Types.ObjectId('63a36a4d3f0f5cf676acf084'),
        email:'bryanw@hotmail.com',

        comments:[],
        assignedBugs:[],
    }),
    new User({
        _id:mongoose.Types.ObjectId('63a36a4d3f0f5cf676acf085'),
        email:'chaikin@aol.com',

        comments:[],
        assignedBugs:[],
    }),
    new User({
        _id:mongoose.Types.ObjectId('63a36a4d3f0f5cf676acf086'),
        email:'phish@verizon.net',

        comments:[],
        assignedBugs:[],
    }),
    new User({
        _id:mongoose.Types.ObjectId('63a36a4d3f0f5cf676acf087'),
        email:'jramio@msn.com',

        comments:[],
        assignedBugs:[],
    }),
    new User({
        _id:mongoose.Types.ObjectId('63a36a4d3f0f5cf676acf088'),
        email:'pakaste@yahoo.ca',

        assignedBugs:[],
        comments:[],
    }),
    new User({
        _id:mongoose.Types.ObjectId('63a36a4d3f0f5cf676acf089'),
        email:'am@live.com',

        comments:[],
        assignedBugs:[], 
    }),
    new User({
        _id:mongoose.Types.ObjectId('63a36a4d3f0f5cf676acf08a'),
        email:'hll21232am@live.com',

        comments:[],
        assignedBugs:[],
    }),
]

module.exports= seedUsers