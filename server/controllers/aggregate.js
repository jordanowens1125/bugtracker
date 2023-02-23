const { default: mongoose } = require("mongoose");
const Bug = require("../models/bug");
const User = require("../models/user");
const Comment = require("../models/comment");
const Project = require("../models/project");

//get users, bugs and projects
const getAll = async (req, res) => {
    try {
        const users = await User.find().populate('project')
        const bugs = await Bug.find().populate("comments").populate("assignedTo");
        const projects = await Project.find().populate("bugs").populate("members");
        res.status(200).json({bugs, projects, users})
    } catch (error) {
        res.status(404).json({ message: error });
    }
}

module.exports = {
  getAll,
};