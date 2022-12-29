const { default: mongoose } = require('mongoose')
const Comment = require('../models/comment')

const getComments = async (req,res)=>{
    try {
        const comments = await Comment.find(
            {bugID:req.params.bugID}
        ).populate('creator')
        res.status(200).json(comments)
    } catch (error) {
        res.status(404).json({message:error})
    }
}

const createComment = async(req,res)=>{
    try {
        const newComment = await Comment.create(req.body)
        res.status(200).json(newComment)
    } catch (error) {
        res.status(404).json({message:error})
    }
}

const deleteComment = async(req,res)=>{
    try {
        //remove this project from the users listed on it
        let comment = await Comment.findOneAndDelete({_id:req.params.id})
        //delete bugs associated with this project
        res.status(200).json(comment.title)
    } catch (error) {
        res.status(404).json({message:error})
    }
}

const getComment = async (req,res)=>{
    try {
        let id = req.params.id
        const comment = await Comment.findById(id)
        res.status(200).json(comment)
    } catch (error) {
        res.status(404).json({message:error})
    }
}

const updateComment = async (req,res)=>{
    try { 
        let _id = req.params.id
        console.log(req.body)
        let {title,description,status,openDate,creator,priority,
            closeDate,history,members,relatedComments,closer,
            comments,projectID,stepsToRecreate} = req.body

        const project = await Comment.findByIdAndUpdate(_id,
            {title,description,status,openDate,creator,priority,
                closeDate,history,members,relatedComments,closer,
                comments,projectID,stepsToRecreate
            })
        res.status(200).json(project)
    } catch (error) {
        res.status(404).json({message:error})
    }
}

const deleteBugComments = async (req,res)=>{
    try {
        const comments = await Comment.deleteMany({bugID:req.params.bugid,})
        res.status(200).json(comments)
    } catch (error) {
        res.status(404).json({message:error})
    }
}

const deleteAllProjectComments = async (req,res)=>{
    console.log(req.params)
    try {
        const comments = await Comment.deleteMany({projectID:req.params.projectid,})
        console.log(comments)
        res.status(200).json(comments)
    } catch (error) {
        res.status(404).json({message:error})
    }
}

module.exports = {getComments, createComment, deleteComment, 
    getComment,deleteBugComments,updateComment,deleteBugComments,
    deleteAllProjectComments,
}