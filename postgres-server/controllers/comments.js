const sql = require("../config/db");

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ bugID: req.params.bugID }).populate(
      "creator"
    );
    res.status(200).json(comments);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const createComment = async (req, res) => {
  try {
    const newComment = await Comment.create(req.body);
    await Project.findByIdAndUpdate(req.body.projectID, {
      $push: {
        comments: newComment._id,
      },
    });
    await Bug.findByIdAndUpdate(req.body.bugID, {
      $push: {
        comments: newComment._id,
      },
    });
    res.status(200).json(newComment);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const deleteComment = async (req, res) => {
  try {
    //remove comment from user
    await User.findByIdAndUpdate(req.body.creator, {
      $pull: {
        comments: req.params.id,
      },
    });

    //remove comment from bug
    await Bug.findByIdAndUpdate(req.body.bugID, {
      $pull: {
        comments: req.params.id,
      },
    });

    //remove comment from project
    await Project.findByIdAndUpdate(req.body.projectID, {
      $pull: {
        comments: req.params.id,
      },
    });
    let comment = await Comment.findOneAndDelete({ _id: req.params.id });
    res.status(200).json(comment);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const getComment = async (req, res) => {
  try {
    let id = req.params.id;
    const comment = await Comment.findById(id);
    res.status(200).json(comment);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const updateComment = async (req, res) => {
  try {
    let _id = req.params.id;
    let {
      title,
      description,
      status,
      openDate,
      creator,
      priority,
      closeDate,
      history,
      members,
      relatedComments,
      closer,
      comments,
      projectID,
      stepsToRecreate,
    } = req.body;

    const comment = await Comment.findByIdAndUpdate(_id, {
      title,
      description,
      status,
      openDate,
      creator,
      priority,
      closeDate,
      history,
      members,
      relatedComments,
      closer,
      comments,
      projectID,
      stepsToRecreate,
    });
    res.status(200).json(comment);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

module.exports = {
  getComments,
  createComment,
  deleteComment,
  getComment,
  updateComment,
};
