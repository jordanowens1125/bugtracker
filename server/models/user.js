const mongoose = require('mongoose')
const { Schema } = mongoose;

const UserSchema = new Schema({
  name:  {type: String}, 
  uid:{type: String,required:true,unique:true}, 
  email:  {type: String, required:true,unique:true}, 
  role: {
    type:String, 
    enum:['admin', 'developer','viewer', 'deleted'],
    default:'viewer',
  },
  assignedBugs:[{type: Schema.Types.ObjectId, ref:'Bug'}],
  comments:[{type: Schema.Types.ObjectId, ref:'Comment'}],
  project:[{type: Schema.Types.ObjectId, ref:'Project'}],
});

module.exports = mongoose.model('User',UserSchema)