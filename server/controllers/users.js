const { default: mongoose } = require("mongoose");
const User = require("../models/user");
const Bug = require("../models/bug");
const Comment = require("../models/comment");
const Project = require("../models/project");
const project = require("../models/project");

const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("project").populate('assignedBugs');
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const findOrCreateUser = async (req, res) => {
  try {
    let foundUser = await User.findOne({ email: req.body.email });
    if (!foundUser) {
      foundUser = await User.create(req.body);
    }
    res.status(200).json(foundUser);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const deleteUser = async (req, res) => {
  try {
    //find user
    let user = await User.findById({ _id: req.params.id });
    //remove user from projects
    await Project.updateMany(
      {},
      {
        $pull: {
          members: req.params.id,
        },
      }
    );
    //delete user from bugs
    await Bug.updateMany(
      {},
      {
        $pull: {
          assignedTo: req.params.id,
        },
      }
    );
    //update user comments to deleted user
    // we want to keep the comments in case there is some useful
    await Comment.updateMany(
      { bugID: req.params.id },
      {
        creator: mongoose.Types.ObjectId("000000000000000000000000"),
      }
    );
    await User.findOneAndDelete({ _id: req.params.id });
    res.status(200).json(user);
    //res.status(200).json()
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const getUser = async (req, res) => {
  try {
    let id = req.params.id;
    const user = await User.findById(id).populate("project");
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const updateUser = async (req, res) => {
  try {
    let id = req.params.id;
    const user = await User.findByIdAndUpdate(id, {
      role: req.body.role,
      name: req.body.name,
      photoURL: req.body.photoURL,
      role: req.body.role,
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const assignBugToUser = async (req, res) => {
  try {
    const userID = req.body.userID;
    const bugID = req.body.bugID;

    await Bug.findByIdAndUpdate(bugID, {
      $addToSet: {
        assignedTo: userID,
      },
    });

    await User.findByIdAndUpdate(userID, {
      $addToSet: {
        assignedBugs: bugID,
      },
    });

    const user = await User.findById(userID).populate("project");

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const unAssignBugFromUser = async (req, res) => {
  try {
    const userID = req.body.userID;
    const bugID = req.body.bugID;

    await Bug.findByIdAndUpdate(bugID, {
      $pull: {
        assignedTo: userID,
      },
    });

    await User.findByIdAndUpdate(userID, {
      $pull: {
        assignedBugs: bugID,
      },
    });

    const user = await User.findById(userID).populate("project");
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const assignUserToProject = async (req, res) => {
  try {
    //get projectid and userid
    const userID = req.params.id;
    const projectID = req.body.projectID;
    //and add user to project and and project to user
    await Project.findByIdAndUpdate(projectID, {
      $addToSet: {
        members: userID,
      },
      
    });

    const user = await User.findByIdAndUpdate(userID, {
      project: projectID,
      assignable: false,
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

const unAssignUsersFromProject = async (req, res) => {
  try {
    const projectID = req.body._id;
    const changedUsers = await User.updateMany(
      {},
      {
        $pull: { project: projectID, assignedBugs: [], assignable: true, },
      }
    );

    res.status(200).json();
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

const unAssignUserFromProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.body.projectID, {
      $pull: {
        members: req.body.userID,
      },
    });
    const user = await User.findByIdAndUpdate(req.body.userID, {
      $pull: {
        //remove project bugs from user
        assignedBugs: {
          $in: project.bugs,
        },
      },
      assignable: true,
      project: undefined,
    });
    //remove the user from the project bugs
    const bugs = await Bug.updateMany(
      { $in: project.bugs },
      {
        $pull: {
          assignedTo: req.body.userID,
        },
      }
    );
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

module.exports = {
  getUsers,
  findOrCreateUser,
  deleteUser,
  getUser,
  unAssignBugFromUser,
  updateUser,
  assignUserToProject,
  assignBugToUser,
  unAssignUserFromProject,
  unAssignUsersFromProject,
};
