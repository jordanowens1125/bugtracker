const supabase = require("../config/db");

const getUsers = async (req, res) => {
  try {
    const users = await supabase.from("Users").select();

    res.status(200).json(users.data);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const deleteUser = async (req, res) => {
  try {
    //find user
    let user = await User.findById({ _id: req.params.id });
    //remove user from projects
    await Project.updateMany(
      {},
      {
        $pull: {
          members: req.params.id,
        },
      }
    );
    //delete user from bugs
    await Bug.updateMany(
      {},
      {
        $pull: {
          assignedTo: req.params.id,
        },
      }
    );
    //update user comments to deleted user
    // we want to keep the comments in case there is some useful
    await Comment.updateMany(
      { bugID: req.params.id },
      {
        creator: mongoose.Types.ObjectId("000000000000000000000000"),
      }
    );
    await User.findOneAndDelete({ _id: req.params.id });
    res.status(200).json(user);
    //res.status(200).json()
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const deleteUsers = async (req, res) => {
  try {
    let { userIDs } = req.body;
    await Project.updateMany(
      {},
      {
        $pull: {
          members: { _id: { $in: userIDs } },
        },
      }
    );
    await Comment.updateMany(
      { creator: { $in: userIDs } },
      {
        creator: mongoose.Types.ObjectId("647dfd59428b6224924a43f3"),
      }
    );

    await Bug.updateMany(
      { assignedTo: { $in: userIDs } },
      {
        assignedTo: undefined,
      }
    );
    await User.deleteMany({ _id: { $in: userIDs } });
    res.status(200).json();
    //res.status(200).json()
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const getUser = async (req, res) => {
  try {
    let id = req.params.id;
    const user = await User.findById(id)
      .populate("project")
      .populate("assignedBugs");
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const getPM = async (req, res) => {
  try {
    let id = req.params.id;
    const user = await User.findById(id).populate([
      {
        path: "project",
        populate: [{ path: "bugs", populate: [{ path: "assignedTo" }] }],
      },
    ]);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const getAdmin = async (req, res) => {
  try {
    const users = await User.find();
    const bugs = await Bug.find().populate("projectID").populate("assignedTo");
    const projects = await Project.find();
    res.status(200).json({ users, bugs, projects });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const updateUser = async (req, res) => {
  try {
    let id = req.params.id;
    const user = await User.findByIdAndUpdate(id, {
      role: req.body.role,
      name: req.body.name,
      photoURL: req.body.photoURL,
      role: req.body.role,
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const updateRoles = async (req, res) => {
  try {
    await User.updateMany(
      { _id: { $in: req.body.members } },
      {
        role: req.body.role,
      }
    );
    res.status(200).json();
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const assignBugToUser = async (req, res) => {
  try {
    const userID = req.body.userID;
    const bugID = req.body.bugID;

    await Bug.findByIdAndUpdate(bugID, {
      $addToSet: {
        assignedTo: userID,
      },
    });

    await User.findByIdAndUpdate(userID, {
      $addToSet: {
        assignedBugs: bugID,
      },
    });

    const user = await User.findById(userID).populate("project");

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const unAssignBugFromUser = async (req, res) => {
  try {
    const userID = req.body.userID;
    const bugID = req.body.bugID;

    await Bug.findByIdAndUpdate(bugID, {
      $pull: {
        assignedTo: userID,
      },
    });

    await User.findByIdAndUpdate(userID, {
      $pull: {
        assignedBugs: bugID,
      },
    });

    const user = await User.findById(userID).populate("project");
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const assignUserToProject = async (req, res) => {
  try {
    //get projectid and userid
    const userID = req.params.id;
    const projectID = req.body.projectID;
    //and add user to project and and project to user
    await Project.findByIdAndUpdate(projectID, {
      $addToSet: {
        members: userID,
      },
    });

    const user = await User.findByIdAndUpdate(userID, {
      project: projectID,
      assignable: false,
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

const unAssignUsersFromProject = async (req, res) => {
  try {
    const projectID = req.body._id;
    const changedUsers = await User.updateMany(
      {},
      {
        $pull: { project: projectID, assignedBugs: [], assignable: true },
      }
    );

    res.status(200).json();
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

const unAssignUserFromProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.body.projectID, {
      $pull: {
        members: req.body.userID,
      },
    });
    const user = await User.findByIdAndUpdate(req.body.userID, {
      $pull: {
        //remove project bugs from user
        assignedBugs: {
          $in: project.bugs,
        },
      },
      assignable: true,
      project: undefined,
    });
    //remove the user from the project bugs
    const bugs = await Bug.updateMany(
      { $in: project.bugs },
      {
        $pull: {
          assignedTo: req.body.userID,
        },
      }
    );
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

const getAvailableUsers = async (req, res) => {
  try {
    const { data: users } = await supabase
      .from("Users")
      .select()
      .eq("assignable", true);
    //filter for pm and developers
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

module.exports = {
  getUsers,
  deleteUser,
  getUser,
  unAssignBugFromUser,
  updateUser,
  assignUserToProject,
  assignBugToUser,
  unAssignUserFromProject,
  unAssignUsersFromProject,
  updateRoles,
  deleteUsers,
  getPM,
  getAdmin,
  getAvailableUsers,
};
