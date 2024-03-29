const mongoose = require("mongoose");
const { Schema } = mongoose;

const TicketSchema = new Schema({
  title: { type: String, required: true },
  creator: { type: Schema.Types.ObjectId, ref: "User" },
  description: String,
  status: {
    type: String,
    enum: [
      "In Progress",
      "Closed",
      "In Review",
      "Open",
    ],
    default: "Open",
  },
  openDate: { type: Date, default: Date.now },
  closeDate: { type: Date },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Low",
  },
  assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
  relatedTickets: [{ type: Schema.Types.ObjectId, ref: "Ticket" }],
  projectID: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  stepsToRecreate: [],
  closer: String,
  history: [],
  tags: [],
});

module.exports = mongoose.model("Ticket", TicketSchema);
