const { default: mongoose } = require("mongoose");
const Bug = require("../models/bug");
const User = require("../models/user");
const Comment = require("../models/comment");
const Project = require("../models/project");

const getBugs = async (req, res) => {
  try {
    const bugs = await Bug.find().populate('projectID').populate('assignedTo');
    res.status(200).json(bugs);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const createBug = async (req, res) => {
  try {
    let bug = req.body;
    if (bug.assignedTo == "") {
      bug.assignedTo = [];
    }
    //add bug to project
    const newBug = await Bug.create(bug);
    await Project.findByIdAndUpdate(bug.projectID, {
      $push: {
        bugs: newBug._id,
      },
    });
    res.status(200).json(newBug);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const deleteBug = async (req, res) => {
  try {
    let bug = await Bug.findById({ _id: req.params.id });

    //remove bug from project
    await Project.findByIdAndUpdate(bug.projectID, {
      $pull: {
        bugs: req.params.id,
      },
    });

    // //delete all bug comments
    await Comment.deleteMany({
      bugID: req.params.id,
    });

    // //remove bug from users
    await User.updateMany(
      {},
      {
        $pull: {
          assignedBugs: req.params.id,
        },
      }
    );

    //delete bug
    await Bug.findByIdAndDelete(req.params.id);

    res.status(200).json(bug);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const getBug = async (req, res) => {
  try {
    let id = req.params.id;
    const bug = await Bug.findById(id)
      .populate("comments")
      .populate("assignedTo");
    res.status(200).json(bug);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const updateBug = async (req, res) => {
  try {
    let _id = req.params.id;
    let updatedBug = req.body.updatedBug;
    let oldBug = req.body.currentBug;

    //remove old users from bug
    await User.findByIdAndUpdate(
      { $in: oldBug.assignedTo },
      {
        $pull: {
          assignedBugs: _id,
        },
      }
    );

    //remove old bug from old related bugs
    await Bug.findByIdAndUpdate(
      { $in: oldBug.relatedBugs },
      {
        $pull: {
          relatedBugs: _id,
        },
      }
    );

    //add bug to new users
    await User.findByIdAndUpdate(
      { $in: updatedBug.assignedTo },
      {
        $addToSet: {
          assignedBugs: _id,
        },
      }
    );

    //add bug to new related bugs
    await Bug.findByIdAndUpdate(
      { $in: updatedBug.relatedBugs },
      {
        $addToSet: {
          relatedBugs: _id,
        },
      }
    );

    const {
      title,
      description,
      status,
      openDate,
      creator,
      priority,
      closeDate,
      history,
      assignedTo,
      relatedBugs,
      closer,
      stepsToRecreate,
    } = updatedBug;

    await Bug.findByIdAndUpdate(_id, {
      title,
      description,
      status,
      openDate,
      creator,
      priority,
      closeDate,
      history,
      relatedBugs,
      closer,
      stepsToRecreate,
      assignedTo: assignedTo,
    });
    const bug = await Bug.findById(_id).populate("assignedTo");
    res.status(200).json(bug);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

module.exports = { getBugs, createBug, deleteBug, getBug, updateBug };
