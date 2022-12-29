const mongoose = require('mongoose')
const { Schema } = mongoose;

const BugSchema = new Schema({
  title:  {type: String, required: true}, 
  creator: String,
  description:  String,
  status: {
    type:String, 
    enum:['In Progress', 'Closed','In Review','Assigned', 'Not Assigned','Open'],
    default:'Open',
  },
  openDate: { type: Date, default: Date.now },
  closeDate: { type: Date },
  priority: {
    type:String, 
    enum:['Low', 'Medium','High'],
    default:'Low',
  },
  assignedTo: [{type: Schema.Types.ObjectId, ref:'User'}],
  relatedBugs:[{type: Schema.Types.ObjectId, ref:'Bug'}],
  projectID:{
    type: Schema.Types.ObjectId, ref:'Project',
    required: true,
  },
  comments:[{type: Schema.Types.ObjectId, ref:'Comment'}],
  stepsToRecreate:[],
  closer: String,
  history:[],
  tags:[]
});

module.exports = mongoose.model('Bug',BugSchema)