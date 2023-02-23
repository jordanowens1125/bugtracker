const express = require("express");
const router = express.Router();
const {
  getComments,
  createComment,
  deleteComment,
  getComment,
  updateComment,
} = require("../controllers/comments");

/* GET users listing. */
router.get("/:bugID", getComments);
router.post("/create", createComment);
router.delete("/:id", deleteComment);
router.get("/:id", getComment);
router.put("/:id", updateComment);
module.exports = router;
