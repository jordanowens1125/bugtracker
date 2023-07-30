const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommentSchema = new Schema({
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
  ticketID: {
    type: Schema.Types.ObjectId,
    ref: "Ticket",
    required: true,
  },
  projectID: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  edited: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Comment", CommentSchema);
