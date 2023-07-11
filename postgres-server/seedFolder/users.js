const { faker } = require("@faker-js/faker");
const unassignedPMCount = 8;
const assignedPMCount = 15;
const developersCount = 30;
const submitterCount = 10;
const demoCount = 4;

const developers = [];
const assignedprojectmanagers = [];
const unassignedpms = []
const submitters = [];

for (let i = demoCount + 1; i < assignedPMCount + demoCount + 1; i++) {
  assignedprojectmanagers.push({
    _id: i,
    email: faker.internet.email(),
    role: "Project Manager",
    name: faker.person.fullName(),
    password: faker.internet.password({ length: 20 }),
    assignable:false
  });
}

const usersbeforeDev = demoCount + assignedPMCount;
for (let i = usersbeforeDev + 1; i < developersCount + usersbeforeDev; i++) {
  developers.push({
    _id: i,
    email: faker.internet.email(),
    role: "Developer",
    name: faker.person.fullName(),
    password: faker.internet.password({ length: 20 }),
    assignable: true,
  });
}

const usersBeforeSubs = usersbeforeDev + developersCount;

for (let i = usersBeforeSubs + 1; i < submitterCount + usersBeforeSubs; i++) {
  submitters.push({
    _id: i,
    email: faker.internet.email(),
    role: "Submitter",
    name: faker.person.fullName(),
    password: faker.internet.password({ length: 20 }),
    assignable: true,
  });
}

const usersBeforeUnassignedpm = usersBeforeSubs + submitterCount;

for (
  let i = usersBeforeUnassignedpm + 1;
  i < usersBeforeUnassignedpm + unassignedPMCount + 1;
  i++
) {
  unassignedpms.push({
    _id: i,
    email: faker.internet.email(),
    role: "Project Manager",
    name: faker.person.fullName(),
    password: faker.internet.password({ length: 20 }),
    assignable: true,
  });
}

const generatedUsers = [
  ...assignedprojectmanagers,
  ...developers,
  ...submitters,
  ...unassignedpms
];

const seedUsers = [
  // {
  //   _id: 0,
  //   email: "deletedUser@live.com",
  //   demo: true,
  //   role: "Deleted",
  //   name: "Deleted User",
  //   assignable: false,
  //   deleted: true,
  //   password: faker.internet.password({ length: 20 }),
  // },
  {
    _id: 3,
    email: "DemoDeveloper@gmail.com",
    demo: true,
    role: "Developer",
    name: "Demo Developer",
    password: "DemoDeveloperPassword456!!!",
  },
  {
    _id: 2,
    email: "DemoAdmin@gmail.com",
    demo: true,
    role: "Admin",
    name: "Demo Admin",
    assignable: false,
    password: "DemoAdminPassword123!!!",
  },
  {
    _id: 4,
    demo: true,
    email: "DemoProjectManager@gmail.com",
    // project: 1,
    assignable: false,
    role: "Project Manager",
    name: "Demo Project Manager",
    password: "DemoPMPassword456!!!",
  },
  ...generatedUsers,
];

module.exports = seedUsers;
