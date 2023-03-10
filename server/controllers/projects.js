const { default: mongoose } = require("mongoose");
const Project = require("../models/project");
const User = require("../models/user");
const Bug = require("../models/bug");
const Comment = require("../models/comment");

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("bugs").populate("members");
    res.status(200).json(projects);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const createProject = async (req, res) => {
  try {
    let project = await Project.create(req.body);
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
          project: req.params.id,
          //remove bugs from user that were on this project
          assignedBugs: { $in: project.bugs },
        },
      },
      {
        multi: true,
      }
    );
    //delete bugs associated with this project
    await Bug.deleteMany({
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
      .populate("bugs")
      .populate("members");

    const unAssignedMembers = await User.find({
      project: [],
      role: "Developer",
    });

    const availableMembers = [...project.members, ...unAssignedMembers];
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
      { $in: oldProject.members },
      {
        $pull: {
          project: req.params.id,
        },
      }
    );

    //remove the members from the project
    await Project.findByIdAndUpdate(req.params.id, {
      $pull: {
        members: { $in: oldProject.members },
      },
    });

    let {
      title,
      description,
      status,
      startDate,
      deadline,
      history,
      members,
      bugs,
      public,
    } = req.body;
    //console.log(members)

    //add the new members to the project
    const users = await User.updateMany(
      { _id: { $in: members } },
      {
        $push: {
          project: req.params.id,
        },
      }
    );

    //remove bugs from users who are no longer in this project

    await Project.findByIdAndUpdate(req.params.id, {
      title,
      description,
      status,
      startDate,
      deadline,
      history,
      members,
      bugs,
      public,
    });

    const project = await Project.findById(req.params.id)
      .populate("members")
      .populate("bugs");

    res.status(200).json(project);
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
