const mongoose = require('mongoose')
const { Schema } = mongoose;

const CommentSchema = new Schema({
  text: {type: String, required: true}, 
  date: { type: Date, default: Date.now },
  bugID:{
    type: Schema.Types.ObjectId, ref:'Bug',
    required:true,
  },
  projectID:{
    type:Schema.Types.ObjectId,ref:'Project',
    required:true,
  },
  creator:{
    type: Schema.Types.ObjectId, ref:'User',
    required:true,
  },
});

module.exports = mongoose.model('Comment',CommentSchema)