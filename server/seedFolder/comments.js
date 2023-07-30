const mongoose = require("mongoose");
const Comment = require("../models/comment");

const seedComments = [
  new Comment({
    _id: mongoose.Types.ObjectId("63ab8d9e45c860aa510785bf"),
    text: "Project0Ticket1",
    date: "2022-10-22",
    ticketID: mongoose.Types.ObjectId("63ab78cc81174e7f3a98fd0e"),
    creator: mongoose.Types.ObjectId("63a36a4d3f0f5cf676acf07c"),
    projectID: mongoose.Types.ObjectId("63ab7ace4e39c16c9b79e3ac"),
  }),
];

module.exports = seedComments;
