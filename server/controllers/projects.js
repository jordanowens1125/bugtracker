const { default: mongoose } = require("mongoose");
const Project = require("../models/project");
const User = require("../models/user");
const Ticket = require("../models/ticket");
const Comment = require("../models/comment");

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("tickets").populate("members");
    res.status(200).json(projects);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    
    await User.updateMany(
      { _id: { $in: [...req.body.members, req.body.projectManager] } },
      {
        project: project._id,
        assignable: false,
      }
    );
    res.status(200).json(project);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    //remove this project from the users listed on it
    const result = await User.updateMany(
      {},
      {
        $pull: {
          //remove tickets from this project
          assignedTickets: { $in: project.tickets },
        },
        assignable: true,
        project: undefined,
      },
      {
        multi: true,
      }
    );
    //delete tickets associated with this project
    await Ticket.deleteMany({
      projectID: req.params.id,
    });
    await Comment.deleteMany({
      projectID: req.params.id,
    });
    let deletedproject = await Project.findOneAndDelete({ _id: req.params.id });
    res.status(200).json(deletedproject);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const getProject = async (req, res) => {
  try {
    let id = req.params.id;
    const project = await Project.findById(id)
      .populate("tickets")
      .populate("projectManager")
      .populate("members");
    const unAssignedMembers = await User.find({
      $or: [
        {
          role: "Project Manager",
        },
        {
          role: "Developer",
        },
      ],
      $and: [
        {
          project: null,
        },
      ],
    });
    const availableMembers = unAssignedMembers;
    res.status(200).json({ project, availableMembers });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const updateProject = async (req, res) => {
  try {
    //find the project by id to get the old member ids
    const oldProject = await Project.findById(req.params.id);

    //remove the project from the old members
    await User.updateMany(
      { _id: { $in: [...oldProject.members, oldProject.projectManager] } },
      {
        project: null,
        assignable: true,
      }
    );

    let { title, description, status, deadline,  members } = req.body;

    //remove the members from the project
    await Project.findByIdAndUpdate(req.params.id, {
      projectManager: req.body.projectManager,
      title,
      description,
      status,
      deadline,
      members,
    });

    //add the new members to the project
    await User.updateMany(
      { _id: { $in: [...members, req.body.projectManager] } },
      {
        project: req.params.id,
        assignable: false,
      }
    );

    res.status(200).json();
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

module.exports = {
  getProjects,
  createProject,
  deleteProject,
  getProject,
  updateProject,
};
