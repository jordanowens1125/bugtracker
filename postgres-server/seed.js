const bcrypt = require("bcrypt");
require("dotenv").config({ path: "./config/.env" });
const supabase = require("./config/db");
const seedUsers = require("./seedFolder/users");
const seedProjects = require("./seedFolder/projects");

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

    //delete projects
    await supabase.from("Projects").delete().neq("_id", 0);

    const del = await supabase.from("Users").delete().neq("_id", 0);
    const data = await supabase.from("Users").insert(usersWithHashedPasswords);

    const projects = await supabase.from("Projects").insert(seedProjects);

    // await Bug.deleteMany({});
    // await Bug.insertMany(seedBugs);

    // console.log(projects);
  } catch (err) {
    console.log(err);
  }
};

seedDB();
