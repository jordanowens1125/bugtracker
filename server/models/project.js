const mongoose = require('mongoose')
const { Schema } = mongoose;

const ProjectSchema = new Schema({
  title:  {type: String, required: true}, //required: true
  description:   String,
  status: {
    type:String, 
    enum:['Behind', 'Completed','On Track'],
    default:'On Track',
  },
  startDate: { type: Date, default: Date.now },
  completionDate: { type: Date },
  deadline: { type: Date },
  history:[],
  client:String,
  members:[{type: Schema.Types.ObjectId, ref:'User'}],
  bugs:[{type: Schema.Types.ObjectId, ref:'Bug'}],
});

module.exports = mongoose.model('Project',ProjectSchema)

