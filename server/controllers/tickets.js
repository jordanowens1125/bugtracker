const { default: mongoose } = require("mongoose");
const Ticket = require("../models/ticket");
const User = require("../models/user");
const Comment = require("../models/comment");
const Project = require("../models/project");

const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("projectID").populate("assignedTo");
    res.status(200).json(tickets);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const getTicketsByUser = async (req, res) => {
  const id = req.params.id;
  try {
    const tickets = await Ticket.find({
      assignedTo: id,
    })
      .populate("projectID")
      .populate("assignedTo");
    res.status(200).json(tickets);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const createTicket = async (req, res) => {
  try {
    let ticket = req.body;
    if (ticket.assignedTo == "") {
      ticket.assignedTo = null;
    }
    //add ticket to project
    const newTicket = await Ticket.create(ticket);
    await Project.findByIdAndUpdate(ticket.projectID, {
      $push: {
        tickets: newTicket._id,
      },
    });

    await User.findByIdAndUpdate(ticket.creator, {
      $push: {
        createdTickets: newTicket._id,
      },
    });

    await User.findByIdAndUpdate(ticket.assignedTo, {
      $push: {
        assignedTickets: newTicket._id,
      },
    });
    res.status(200).json(newTicket);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const deleteTicket = async (req, res) => {
  try {
    let ticket = await Ticket.findById({ _id: req.params.id });

    //remove ticket from project
    await Project.findByIdAndUpdate(ticket.projectID, {
      $pull: {
        tickets: req.params.id,
      },
    });

    // //delete all ticket comments
    await Comment.deleteMany({
      ticketID: req.params.id,
    });

    // //remove ticket from users
    await User.updateMany(
      {},
      {
        $pull: {
          assignedTickets: req.params.id,
        },
      }
    );

    //delete ticket
    await Ticket.findByIdAndDelete(req.params.id);

    res.status(200).json(ticket);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const getTicket = async (req, res) => {
  try {
    let id = req.params.id;
    const ticket = await Ticket.findById(id)
      //linking ticket comments info while also getting the comments creator/user info
      .populate([{ path: "comments", populate: [{ path: "creator" }] }])
      .populate("projectID")
      .populate("assignedTo");
    const members = await User.find({
      project: ticket.projectID._id,
    });
    res.status(200).json({ ticket, members });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const updateTicket = async (req, res) => {
  try {
    let _id = req.params.id;
    let updatedTicket = req.body.updatedTicket;
    let oldTicket = req.body.currentTicket;
    //remove old users from ticket
    if (oldTicket.assignedTo) {
      await User.findByIdAndUpdate(
        { _id: oldTicket.assignedTo },
        {
          $pull: {
            assignedTickets: _id,
          },
        }
      );
    }
    
    if (updatedTicket.assignedTo) {
      //add ticket to new user
      await User.findByIdAndUpdate(
        { _id: updatedTicket.assignedTo },
        {
          $addToSet: {
            assignedTickets: _id,
          },
        }
      );
    }

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
      relatedTickets,
      closer,
      stepsToRecreate,
    } = updatedTicket;
    if (assignedTo) {
      await Ticket.findByIdAndUpdate(_id, {
        title,
        description,
        status,
        openDate,
        creator,
        priority,
        closeDate,
        history,
        relatedTickets,
        closer,
        stepsToRecreate,
        assignedTo,
      });
    } else {
      const ticket = await Ticket.findByIdAndUpdate(_id, {
        title,
        description,
        status,
        openDate,
        creator,
        priority,
        closeDate,
        history,
        relatedTickets,
        closer,
        stepsToRecreate,
        assignedTo: null,
      });
    }
    //const ticket = await Ticket.findById(id);
    res.status(200).json();
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

module.exports = {
  getTickets,
  createTicket,
  deleteTicket,
  getTicket,
  updateTicket,
  getTicketsByUser,
};
