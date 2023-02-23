const express = require("express");
const router = express.Router();
const {
  getProjects,
  createProject,
  deleteProject,
  getProject,
  updateProject,
} = require("../controllers/projects");

/* GET project listings. */
router.get("/", getProjects);
router.post("/create", createProject);
router.delete("/delete/:id", deleteProject);
router.get("/:id", getProject);
router.put("/:id", updateProject);

module.exports = router;
