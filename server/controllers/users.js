const { default: mongoose } = require('mongoose')
const User = require('../models/user')

const getUsers = async (req,res)=>{
    try {
        const users = await User.find().populate('project')
        res.status(200).json(users)
    } catch (error) {
        res.status(404).json({message:error})
    }
}

const createUser = async(req,res)=>{
    try {
        let user = User.create(req.body)
        res.status(200).json(user)
    } catch (error) {
        
        res.status(404).json({message:error})
    }
}

const deleteUser = async(req,res)=>{
    try {
        //remove this project from the users listed on it
        let user = await User.findOneAndDelete({_id:req.params.id})
        //delete bugs associated with this project
        res.status(200).json(user)
        //res.status(200).json()
    } catch (error) {
        res.status(404).json({message:error})
    }
}

const getUser = async (req,res)=>{
    try {
        let id = req.params.id
        const user = await User.findById(id)
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json({message:error})
    }
}

const updateUser = async (req,res)=>{
    try {
        let id = req.params.id
        let {name,password} = req.body
        const user = await User.findByIdAndUpdate(id,
            {name,password}
        )
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json({message:error})
    }
}
const addUserToProject = async (req,res)=>{
    try {
        let id = req.params.id
        const user = await User.findOneAndUpdate({_id:id},{
            $push:{
                projects:mongoose.Types.ObjectId(req.params.projectid)
            }})
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json({message:error})
    }
}
const deleteUserFromProject = async (req,res)=>{
    try {
        let id = req.params.id
        const user = await User.updateOne({_id:id},{
            $pull:{
                projects:mongoose.Types.ObjectId(req.params.projectid)
            }
        })
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json({message:error})
    }
}

const assignBugToUser= async(req,res)=>{
    try {
        let id = req.params.id
        const user = await User.updateOne(                
            {_id:id},
            {$addToSet:
                {assignedBugs:req.params.bugid}}
        )
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json({message:error})
    }
}

const unAssignBugFromUser= async(req,res)=>{
    try {
        //assigedTo may be equal to Unassigned
        const userID= req.body.assignedTo
        if(userID!='Unassigned'){
            const user = await User.updateOne({_id:userID},{
            $pull:{
                assignedBugs:req.body._id
            }
        })
        }
        
        res.status(200).json()
    } catch (error) {
        res.status(404).json({message:error})
    }
}

const addUserComment= async(req,res)=>{
    try {
        const user = await User.updateOne({_id:req.body.userID},{
            $push:{
                comments:req.body.commentID
            }
        })
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json({message:error})
    }
}

const removeUserComment= async(req,res)=>{
    try {
        let id = req.params.id
        const user = await User.updateOne({_id:id},{
            $pull:{
                comments:mongoose.Types.ObjectId(req.params.commentid)
            }
        })
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json({message:error})
    }
}
const addUsersToProject = async(req,res)=>{ 
    try {
        const memberIDs= req.body.members
        const projectID = req.body._id
        for(let i=0;i<memberIDs.length;i++){
            await User.updateOne(
                {_id:memberIDs[i]},
                {$addToSet:{project:projectID}}
            )
        }
        res.status(200).json()
    } catch (error) {
        res.status(404).json({message:error})
    }
}
const unAssignUsersFromProject = async(req,res)=>{
    try{
        const memberIDs= req.body.members
        const projectID = req.body._id
        for(let i=0;i<memberIDs.length;i++){
            await User.updateMany(
                {},
                {$pull:{project:projectID}}
            )
        }
        res.status(200).json()
    }catch(err){
        res.status(404).json({message:err})
    }
}

module.exports = {getUsers, createUser, deleteUser, getUser,
    deleteUserFromProject,unAssignBugFromUser,assignBugToUser,
    addUserToProject,updateUser,removeUserComment,addUserComment,
    addUsersToProject,unAssignUsersFromProject,
}