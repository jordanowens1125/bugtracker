const supabase = require("../config/db");

const getProjects = async (req, res) => {
  try {
    const projects = await supabase.from("Projects").select();

    // Project.find().populate("bugs").populate("members");
    res.status(200).json(projects.data);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const createProject = async (req, res) => {
  const { members: memberIds } = req.body.members;
  delete req.body.members;
  delete req.body.history;
  console.log(req.body);
  try {
    const project = await supabase.from("Projects").insert(req.body).select();
    if (project.data) {
      res.status(200).json(project);
    } else {
      throw new Error(project.error.message);
    }
    // await User.updateMany(
    //   { _id: { $in: [...req.body.members, req.body.projectManager] } },
    //   {
    //     project: project._id,
    //     assignable: false,
    //   }
    // );
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    //remove this project from the users listed on it
    const result = await User.updateMany(
      {},
      {
        $pull: {
          //remove bugs from this project
          assignedBugs: { $in: project.bugs },
        },
        assignable: true,
        project: undefined,
      },
      {
        multi: true,
      }
    );
    //delete bugs associated with this project
    await Bug.deleteMany({
      projectID: req.params.id,
    });
    await Comment.deleteMany({
      projectID: req.params.id,
    });
    let deletedproject = await Project.findOneAndDelete({ _id: req.params.id });
    res.status(200).json(deletedproject);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const getProject = async (req, res) => {
  try {
    let id = req.params.id;
    const { data: project } = await supabase
      .from("Projects")
      .select()
      .eq("_id", id)
      .limit(1)
      .maybeSingle();

    if (!project) {
      throw Error("New Project found");
    }

    const { data: members } = await supabase
      .from("Users")
      .select()
      .eq("project", id);

    const { data: bugs } = await supabase
      .from("Bugs")
      .select()
      .eq("projectID", id);

    project.members = members.filter((user) => user.role === "Developer");
    project.projectManager = members.filter(
      (user) => user.role === "Project Manager"
    )[0];
    
    project.bugs = bugs;

    // const project = await Project.findById(id)
    //   .populate("bugs")
    //   .populate("projectManager")
    //   .populate("members");
    // const unAssignedMembers = await User.find({
    //   $or: [
    //     {
    //       role: "Project Manager",
    //     },
    //     {
    //       role: "Developer",
    //     },
    //   ],
    //   $and: [
    //     {
    //       project: null,
    //     },
    //   ],
    // });
    // const availableMembers = unAssignedMembers;
    const availableMembers = [];
    res.status(200).json({ project, availableMembers });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    //find the project by id to get the old member ids
    const oldProject = await Project.findById(req.params.id);

    //remove the project from the old members
    await User.updateMany(
      { _id: { $in: [...oldProject.members, oldProject.projectManager] } },
      {
        project: null,
        assignable: true,
      }
    );

    let { title, description, status, deadline, members } = req.body;

    //remove the members from the project
    await Project.findByIdAndUpdate(req.params.id, {
      projectManager: req.body.projectManager,
      title,
      description,
      status,
      deadline,
      members,
    });

    //add the new members to the project
    await User.updateMany(
      { _id: { $in: [...members, req.body.projectManager] } },
      {
        project: req.params.id,
        assignable: false,
      }
    );

    res.status(200).json();
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

module.exports = {
  getProjects,
  createProject,
  deleteProject,
  getProject,
  updateProject,
};
