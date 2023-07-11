const supabase = require("../config/db");

const getBugs = async (req, res) => {
  try {
    const { data: bugs } = await supabase.from("Bugs").select();

    res.status(200).json(bugs);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getBugsByUser = async (req, res) => {
  const id = req.params.id;
  try {
    const bugs = await Bug.find({
      assignedTo: id,
    })
      .populate("projectID")
      .populate("assignedTo");
    res.status(200).json(bugs);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const createBug = async (req, res) => {
  try {
    let bug = req.body;
    if (bug.assignedTo == "") {
      bug.assignedTo = null;
    }
    //add bug to project
    const newBug = await Bug.create(bug);
    await Project.findByIdAndUpdate(bug.projectID, {
      $push: {
        bugs: newBug._id,
      },
    });

    await User.findByIdAndUpdate(bug.creator, {
      $push: {
        createdBugs: newBug._id,
      },
    });

    await User.findByIdAndUpdate(bug.assignedTo, {
      $push: {
        assignedBugs: newBug._id,
      },
    });
    res.status(200).json(newBug);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const deleteBug = async (req, res) => {
  try {
    let bug = await Bug.findById({ _id: req.params.id });

    //remove bug from project
    await Project.findByIdAndUpdate(bug.projectID, {
      $pull: {
        bugs: req.params.id,
      },
    });

    // //delete all bug comments
    await Comment.deleteMany({
      bugID: req.params.id,
    });

    // //remove bug from users
    await User.updateMany(
      {},
      {
        $pull: {
          assignedBugs: req.params.id,
        },
      }
    );

    //delete bug
    await Bug.findByIdAndDelete(req.params.id);

    res.status(200).json(bug);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const getBug = async (req, res) => {
  try {
    let id = req.params.id;

    const { data: bug } = await supabase
      .from("Bugs")
      .select()
      .eq("_id", id)
      .limit(1)
      .maybeSingle();

    if (!bug) {
      throw Error("New bug found");
    }

    const { data: project } = await supabase
      .from("Projects")
      .select()
      .eq("_id", bug.projectID)
      .limit(1)
      .maybeSingle();

    if (!project) {
      throw Error("New project found associated with bug");
    }

    // const bug = await Bug.findById(id)
    //   //linking bug comments info while also getting the comments creator/user info
    //   .populate([{ path: "comments", populate: [{ path: "creator" }] }])
    //   .populate("projectID")
    //   .populate("assignedTo");
    const { data: members } = await supabase
      .from("Users")
      .select()
      .eq("project", bug.projectID);

    bug.projectID = project;
    const { data: comments } = await supabase
      .from("Comments")
      .select()
      .eq("bugID", id);

    bug.comments = comments;

    res.status(200).json({ bug, members });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

const updateBug = async (req, res) => {
  try {
    let _id = req.params.id;
    let updatedBug = req.body.updatedTicket;
    let oldBug = req.body.currentTicket;
    //remove old users from bug
    if (oldBug.assignedTo) {
      await User.findByIdAndUpdate(
        { _id: oldBug.assignedTo },
        {
          $pull: {
            assignedBugs: _id,
          },
        }
      );
    }

    if (updatedBug.assignedTo) {
      //add bug to new user
      await User.findByIdAndUpdate(
        { _id: updatedBug.assignedTo },
        {
          $addToSet: {
            assignedBugs: _id,
          },
        }
      );
    }

    const {
      title,
      description,
      status,
      openDate,
      creator,
      priority,
      closeDate,
      history,
      assignedTo,
      relatedBugs,
      closer,
      stepsToRecreate,
    } = updatedBug;
    if (assignedTo) {
      await Bug.findByIdAndUpdate(_id, {
        title,
        description,
        status,
        openDate,
        creator,
        priority,
        closeDate,
        history,
        relatedBugs,
        closer,
        stepsToRecreate,
        assignedTo,
      });
    } else {
      const bug = await Bug.findByIdAndUpdate(_id, {
        title,
        description,
        status,
        openDate,
        creator,
        priority,
        closeDate,
        history,
        relatedBugs,
        closer,
        stepsToRecreate,
        assignedTo: null,
      });
    }
    //const bug = await Bug.findById(id);
    res.status(200).json();
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

module.exports = {
  getBugs,
  createBug,
  deleteBug,
  getBug,
  updateBug,
  getBugsByUser,
};
