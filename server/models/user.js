const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String },
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ["Admin", "Developer", "Viewer", "Deleted"],
    default: "Viewer",
  },
  assignedBugs: [{ type: Schema.Types.ObjectId, ref: "Bug" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  project: { type: Schema.Types.ObjectId, ref: "Project", },
  assignable: { type: Boolean, default: true },
  deleted: { type: Boolean, default: false },
  //profile image
  photoURL: { type: String },
});

//making a static signup method
//this keyword only works with function not arrow functions
UserSchema.statics.signIn = async function (email, name, photoURL, uid) {
  const exists = await this.findOne({ email });
  if (exists) {
    //throw Error('Email already in use')
    //return already made account
    return exists;
  }

  const user = await this.create({
    email,
    name,
    uid,
    photoURL,
  });

  return user;
};

module.exports = mongoose.model("User", UserSchema);
