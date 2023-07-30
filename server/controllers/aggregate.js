const { default: mongoose } = require("mongoose");
const Ticket = require("../models/ticket");
const User = require("../models/user");
const Comment = require("../models/comment");
const Project = require("../models/project");

//get users, tickets and projects
const getAll = async (req, res) => {
    try {
        const users = await User.find().populate('project')
        const tickets = await Ticket.find().populate("comments").populate("assignedTo");
        const projects = await Project.find().populate("tickets").populate("members");
        res.status(200).json({tickets, projects, users})
    } catch (error) {
        res.status(404).json({ message: error });
    }
}

module.exports = {
  getAll,
};