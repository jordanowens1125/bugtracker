const { default: mongoose } = require("mongoose");
const User = require("../models/user");
const Ticket = require("../models/ticket");
const Comment = require("../models/comment");
const Project = require("../models/project");

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("project")
      .populate("assignedTickets");
    res.status(200).json(users);
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
    //delete user from tickets
    await Ticket.updateMany(
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
      { ticketID: req.params.id },
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

const deleteUsers = async (req, res) => {
  try {
    let { userIDs } = req.body;
    await Project.updateMany(
      {},
      {
        $pull: {
          members: { _id: { $in: userIDs } },
        },
      }
    );
    await Comment.updateMany(
      { creator: { $in: userIDs } },
      {
        creator: mongoose.Types.ObjectId("647dfd59428b6224924a43f3"),
      }
    );

    await Ticket.updateMany(
      { assignedTo: { $in: userIDs } },
      {
        assignedTo: undefined,
      }
    );
    await User.deleteMany({ _id: { $in: userIDs } });
    res.status(200).json();
    //res.status(200).json()
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const getUser = async (req, res) => {
  try {
    let id = req.params.id;
    const user = await User.findById(id)
      .populate("project")
      .populate("assignedTickets");
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const getPM = async (req, res) => {
  try {
    let id = req.params.id;
    const user = await User.findById(id).populate([
      {
        path: "project",
        populate: [{ path: "tickets", populate: [{ path: "assignedTo" }] }],
      },
    ]);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const getAdmin = async (req, res) => {
  try {
    const users = await User.find();
    const tickets = await Ticket.find().populate("projectID").populate("assignedTo");
    const projects = await Project.find();
    res.status(200).json({ users, tickets, projects });
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

const updateRoles = async (req, res) => {
  try {
    await User.updateMany(
      { _id: { $in: req.body.members } },
      {
        role: req.body.role,
      }
    );
    res.status(200).json();
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const assignTicketToUser = async (req, res) => {
  try {
    const userID = req.body.userID;
    const ticketID = req.body.ticketID;

    await Ticket.findByIdAndUpdate(ticketID, {
      $addToSet: {
        assignedTo: userID,
      },
    });

    await User.findByIdAndUpdate(userID, {
      $addToSet: {
        assignedTickets: ticketID,
      },
    });

    const user = await User.findById(userID).populate("project");

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const unAssignTicketFromUser = async (req, res) => {
  try {
    const userID = req.body.userID;
    const ticketID = req.body.ticketID;

    await Ticket.findByIdAndUpdate(ticketID, {
      $pull: {
        assignedTo: userID,
      },
    });

    await User.findByIdAndUpdate(userID, {
      $pull: {
        assignedTickets: ticketID,
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
        $pull: { project: projectID, assignedTickets: [], assignable: true },
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
        //remove project tickets from user
        assignedTickets: {
          $in: project.tickets,
        },
      },
      assignable: true,
      project: undefined,
    });
    //remove the user from the project tickets
    const tickets = await Ticket.updateMany(
      { $in: project.tickets },
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

const getAvailableUsers = async (req, res) => {
  try {
    const users = await User.find({
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
          project: undefined,
        },
      ],
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: err });
  }
};

module.exports = {
  getUsers,
  deleteUser,
  getUser,
  unAssignTicketFromUser,
  updateUser,
  assignUserToProject,
  assignTicketToUser,
  unAssignUserFromProject,
  unAssignUsersFromProject,
  updateRoles,
  deleteUsers,
  getPM,
  getAdmin,
  getAvailableUsers,
};
