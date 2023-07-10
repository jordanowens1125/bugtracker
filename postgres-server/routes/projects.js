const express = require("express");
const router = express.Router();
const {
  getProjects,
  createProject,
  deleteProject,
  getProject,
  updateProject,
  updateMembers,
} = require("../controllers/projects");

//require auth
const requireAuth = require("../middleware/requireAuth");
router.use(requireAuth);

/* GET project listings. */
router.get("/", getProjects);
router.post("/create", createProject);
router.delete("/delete/:id", deleteProject);
router.get("/:id", getProject);
router.put("/:id", updateProject);

module.exports = router;
