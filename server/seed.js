const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const Project = require("./models/project");
const Ticket = require("./models/ticket");
const Comment = require("./models/comment");
require("dotenv").config({ path: "./config/.env" });
const connectDB = require("./config/db");
const seedProjects = require("./seedFolder/projects");
const seedUsers = require("./seedFolder/users");
const seedTickets = require("./seedFolder/tickets");
const seedComments = require("./seedFolder/comments");

const saltRounds = 10;

const seedDB = async () => {
  try {
    const usersWithHashedPasswordsPromiseArray = seedUsers.map(async (user) => {
      let hashedPassword = await bcrypt.hash(user.password, saltRounds);
      user.password = hashedPassword;
      return user;
    });

    const usersWithHashedPasswords = await Promise.all(
      usersWithHashedPasswordsPromiseArray
    );

    await connectDB();
    await User.deleteMany({});
    await User.insertMany(usersWithHashedPasswords);

    await Ticket.deleteMany({});
    await Ticket.insertMany(seedTickets);

    await Project.deleteMany({});
    await Project.insertMany(seedProjects);
  } catch (err) {
    console.log(err);
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
