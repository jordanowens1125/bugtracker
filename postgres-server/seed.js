const bcrypt = require("bcrypt");
require("dotenv").config({ path: "./config/.env" });
const supabase = require("./config/db");
const seedUsers = require("./seedFolder/users");
const seedProjects = require("./seedFolder/projects");
const seedBugs = require("./seedFolder/bugs");

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

    await supabase.from("Users").delete().neq("_id", 0);
    await supabase.from("Users").insert(usersWithHashedPasswords);

    await supabase.from("Projects").insert(seedProjects);

    await supabase.from("Bugs").delete().neq("_id", 0);
    await supabase.from("Bugs").insert(seedBugs);
    
    // console.log(projects);
  } catch (err) {
    console.log(err);
  }
};

seedDB();
