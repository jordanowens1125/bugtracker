const { default: mongoose } = require('mongoose')
const Bug = require('../models/bug')

const getBugs = async (req,res)=>{
    try {
        const bugs = await Bug.find()
        res.status(200).json(bugs)
    } catch (error) {
        res.status(404).json({message:error})
    }
}

const createBug = async(req,res)=>{
    try {
        var bugID = mongoose.Types.ObjectId();
        let bug=req.body
        bug['_id']=bugID
        console.log(bug)
        const newBug = await Bug.create(bug)
        res.status(200).json(newBug)
    } catch (error) {
        res.status(404).json({message:error})
    }
}

const deleteBug = async(req,res)=>{
    try {
        //remove this project from the users listed on it
        let bug = await Bug.findOneAndDelete({_id:req.params.id})
        //delete bugs associated with this project
        res.status(200).json(bug.title)
    } catch (error) {
        res.status(404).json({message:error})
    }
}

const getBug = async (req,res)=>{
    try {
        let id = req.params.id
        const bug = await Bug.findById(id)
        res.status(200).json(bug)
    } catch (error) {
        res.status(404).json({message:error})
    }
}

const deleteProjectBugs = async (req,res)=>{
    try {
        let projectid = req.params.projectid
        const bug = await Bug.deleteMany({projectID:projectid,})
        res.status(200).json(bug)
    } catch (error) {
        res.status(404).json({message:error})
    }
}

const updateBug = async (req,res)=>{
    try { 
        let _id = req.params.id
        console.log(req.body)
        let {title,description,status,openDate,creator,priority,
            closeDate,history,members,relatedBugs,closer,
            comments,projectID,stepsToRecreate} = req.body

        const project = await Bug.findByIdAndUpdate(_id,
            {title,description,status,openDate,creator,priority,
                closeDate,history,members,relatedBugs,closer,
                comments,projectID,stepsToRecreate
            })
        //console.log(project)
        res.status(200).json(project)
    } catch (error) {
        res.status(404).json({message:error})
    }
}

const unAssignUserFromBugs = async(req,res)=>{
    try{
        let userID = req.body._id
        let bugIds= req.body.assignedBugs
        for(let i=0;i<bugIds.length;i++){
            await Bug.updateOne({_id:bugIds[i]},{
                $pull:{
                    assignedTo:mongoose.Types.ObjectId(userID),
                }
            })
        }
        res.status(200).json()
    }
    catch(err){
        res.status(404).json({message:err})
    }
}

module.exports = {getBugs, createBug, deleteBug, 
    getBug,deleteProjectBugs,updateBug,unAssignUserFromBugs,
}