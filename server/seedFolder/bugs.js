const mongoose = require('mongoose')
const Bug = require('../models/bug')

const seedBugs =[
    new Bug({
        _id:mongoose.Types.ObjectId('63ab78cc81174e7f3a98fd0e'),
        title:'Project0Bug1',
        description:'dummy',
        status:'Open',
        openDate:'2022-02-07',
        closeDate:'2022-12-05',
        priority:'Low',
        assignedTo:mongoose.Types.ObjectId('63a36a4d3f0f5cf676acf07c'),
        relatedBugs:[],
        projectID:mongoose.Types.ObjectId("63ab7ace4e39c16c9b79e3ac"),
        comments:["63ab8d9e45c860aa510785bf",],
        stepsToRecreate:[],
        closer:'',
        history:[],
        tags:[],
    }),
]

module.exports=seedBugs