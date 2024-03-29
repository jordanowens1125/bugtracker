const mongoose = require("mongoose");
const User = require("../models/user");
const { faker } = require("@faker-js/faker");
const projectManagersCount = 5;
const developersCount = 30;
const submitterCount = 10;

const developers = [];
const projectmanagers = [];
const submitters = [];

for (let i = 0; i < developersCount; i++) {
  developers.push(
    new User({
      email: faker.internet.email(),
      role: "Developer",
      name: faker.person.fullName(),
      password: faker.internet.password({ length: 20 }),
    })
  );
}

for (let i = 0; i < projectManagersCount; i++) {
  projectmanagers.push(
    new User({
      email: faker.internet.email(),
      role: "Project Manager",
      name: faker.person.fullName(),
      password: faker.internet.password({ length: 20 }),
    })
  );
}

for (let i = 0; i < submitterCount; i++) {
  submitters.push(
    new User({
      email: faker.internet.email(),
      role: "Submitter",
      name: faker.person.fullName(),
      password: faker.internet.password({ length: 20 }),
    })
  );
}

const generatedUsers = [...projectmanagers, ...developers, ...submitters];

const seedUsers = [
  new User({
    _id: mongoose.Types.ObjectId("647dfd59428b6224924a43f3"),
    email: "deletedUser@live.com",
    demo: true,
    role: "Deleted",
    name: "Deleted User",
    assignable: false,
    deleted: true,
    password: faker.internet.password({ length: 20 }),
  }),
  new User({
    _id: new mongoose.Types.ObjectId("649b03f0be6adba7faa4e0d5"),
    email: "DemoDeveloper@gmail.com",
    demo: true,
    comments: [],
    assignedTickets: [],
    role: "Developer",
    name: "Demo Developer",
    password: "DemoDeveloperPassword456!!!",
  }),
  new User({
    _id: new mongoose.Types.ObjectId("649b03f0be6adba7faa4e0e2"),
    email: "DemoAdmin@gmail.com",
    demo: true,
    comments: [],
    assignedTickets: [],
    role: "Admin",
    name: "Demo Admin",
    assignable: false,
    password: "DemoAdminPassword123!!!",
  }),
  new User({
    _id: new mongoose.Types.ObjectId("649b03f0be6adba7faa4e0d9"),
    demo: true,
    email: "DemoProjectManager@gmail.com",
    project: new mongoose.Types.ObjectId("63ab7ace4e39c16c9b79e3ac"),
    assignable: false,
    comments: [],
    assignedTickets: [],
    role: "Project Manager",
    name: "Demo Project Manager",
    password: "DemoPMPassword456!!!",
  }),
  ...generatedUsers,
];

module.exports = seedUsers;
