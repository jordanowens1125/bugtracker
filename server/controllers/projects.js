const { default: mongoose } = require('mongoose')
const Project = require('../models/project')

const getProjects = async (req,res)=>{
    try {
        const projects = await Project.find().populate('bugs').populate('members')
        res.status(200).json(projects)
    } catch (error) {
        res.status(404).json({message:error})
    }
}

const createProject = async(req,res)=>{
    try {
        let project = await Project.create(req.body)
        res.status(200).json(project)
    } catch (error) {
        res.status(404).json({message:error})
    }
}

const deleteProject = async(req,res)=>{
    try {
        //remove this project from the users listed on it
        let project = await Project.findOneAndDelete({_id:req.params.id})
        //delete bugs associated with this project
        res.status(200).json(project)
    } catch (error) {
        res.status(404).json({message:error})
    }
}

const getProject = async (req,res)=>{
    try {
        let id = req.params.id
        const project = await Project.findById(id).populate('bugs').populate('members')

        res.status(200).json(project)
    } catch (error) {
        res.status(404).json({message:error})
    }
}
const updateProject = async (req,res)=>{
    try {
        let _id = req.params.id
        let {title,description,status,startDate,deadline,history,members,bugs} = req.body
        delete req.body._id
        const project = await Project.findByIdAndUpdate(_id,{title,description,status,
            startDate,deadline,history,members,bugs})
        //console.log(project)
        res.status(200).json(project)
    } catch (error) {
        res.status(404).json({message:error})
    }
}
const addBugToProject = async(req,res)=>{
    try {
        const project = await Project.findOneAndUpdate({_id:req.params.id},{$push:{bugs: req.body.bugID}}); 
        res.status(200).json(project)
    } catch (error) {
        res.status(404).json({message:error})
    }
}
const deleteBugFromProject = async(req,res)=>{
    try {
        const project = await Project.updateOne({_id:req.params.id},{
            $pull:{
                bugs: mongoose.Types.ObjectId(req.params.bugid),
            }
        }); 
        res.status(200).json(project)
    } catch (error) {
        res.status(404).json({message:error})
    }
}

const removeUserFromProjects = async(req,res)=>{
    //receives user object
    //includes list of project ids in which
    //will be looped through to remove userid through
    //each project
    try {
        const userID= req.body._id
            await Project.updateOne(
                {},
                {$pull:{members:userID}}
            )
        res.status(200).json()
    } catch (error) {
        res.status(404).json({message:error})
    }
}

const addCommentToProject=async(req,res)=>{
    try{
        const project = await Project.findOneAndUpdate({_id:req.params.id},{$push:{comments: req.body.commentID}}); 
        res.status(200).json(project)
    }catch(error){
        res.status(404).json({message:error})
    }
}
module.exports = {getProjects, createProject, deleteProject, 
    getProject,updateProject,addBugToProject,deleteBugFromProject,
    removeUserFromProjects,addCommentToProject,
}