const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const validator = require("validator");

const UserSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ["Admin", "Developer", "Viewer", "Deleted", "Project Manager", "Reviewer"],
    default: "Viewer",
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  assignedBugs: [{ type: Schema.Types.ObjectId, ref: "Bug" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  project: { type: Schema.Types.ObjectId, ref: "Project" },
  assignable: { type: Boolean, default: true },
  deleted: { type: Boolean, default: false },
  //profile image
  photoURL: { type: String },
});

//making a static signup method
//this keyword only works with function not arrow functions
UserSchema.statics.signIn = async function (email, password) {
  //validate email n password
  if (!email || !password) {
    throw Error("All fields are required");
  }
  const user = await this.findOne({ email }).select("+password");
  if (!user) {
    throw Error("No account found with that email address.");
  }
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

UserSchema.statics.signUp = async function (email, password, name, role) {
  //validate email n password
  if (!email || !password) {
    throw Error("All fields are required");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }

  if (!validator.isStrongPassword(password)) {
    //Send back details about criteria for a password strength
    throw Error("Password is not strong enough");
  }

  const exists = await this.findOne({ email });
  if (exists) {
    throw Error("Email already in use");
  }

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash, name, role });
  return user;
};

module.exports = mongoose.model("User", UserSchema);
