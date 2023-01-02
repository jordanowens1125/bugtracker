const { default: mongoose } = require('mongoose')
const Bug = require('../models/bug')

const getBugs = async (req,res)=>{
    try {
        const bugs = await Bug.find().populate('projectID').populate('comments').populate('assignedTo')
        res.status(200).json(bugs)
    } catch (error) {
        res.status(404).json({message:error})
    }
}

const createBug = async(req,res)=>{
    try {
        var bugID = mongoose.Types.ObjectId();
        let bug=req.body
        if(bug.assignedTo==''){
            bug.assignedTo=[]
        }
        bug['_id']=bugID
        const newBug = await Bug.create(bug)
        res.status(200).json(newBug)
    } catch (error) {
        res.status(404).json({message:error})
    }
}

const addCommentToBug = async(req,res)=>{
    try {
        const bug = await Bug.findOneAndUpdate({_id:req.body.bugID},{
            $push:{
                comments:req.body.commentID
            }
        })
        res.status(200).json(bug)
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
        const bug = await Bug.findById(id).populate('comments').populate('assignedTo')
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
        let {title,description,status,openDate,creator,priority,
            closeDate,history,assignedTo,relatedBugs,closer,
            comments,projectID,stepsToRecreate} = req.body
        if(assignedTo=='Unassigned' ||assignedTo==''||assignedTo==undefined){
            assignedTo=null
        }
        if(!assignedTo){
            await Bug.findByIdAndUpdate({_id:_id},{
                $unset:{assignedTo:''}
            })
        }
        const bug = await Bug.findByIdAndUpdate(_id,
            {title,description,status,openDate,creator,priority,
                closeDate,history,assignedTo,relatedBugs,closer,
                comments,projectID,stepsToRecreate
            })
        res.status(200).json(bug)
    } catch (error) {
        res.status(404).json({message:error})
    }
}
const unAssignUserFromBugs = async(req,res)=>{
    try{
        const bugs= await Bug.updateMany(
            {},
            {$pull:{assignedTo:req.body._id}}
        )
        console.log(bugs)
        res.status(200).json()
    }
    catch(err){
        res.status(404).json({message:err})
    }
}
module.exports = {getBugs, createBug, deleteBug, 
    getBug,deleteProjectBugs,updateBug,unAssignUserFromBugs,
    addCommentToBug,
}