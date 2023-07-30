const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProjectSchema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["Production", "Development"],
    default: "Development",
  },
  startDate: { type: Date, default: Date.now },
  completionDate: { type: Date },
  deadline: { type: Date },
  history: [],
  client: String,
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  projectManager: { type: Schema.Types.ObjectId, ref: "User" },
  tickets: [{ type: Schema.Types.ObjectId, ref: "Ticket" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  public: { type: Boolean, default: false },
});

module.exports = mongoose.model("Project", ProjectSchema);
