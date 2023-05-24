const express = require("express");
const router = express.Router();
const {
  getBugs,
  createBug,
  deleteBug,
  getBug,
  updateBug,
  getBugsByUser,
} = require("../controllers/bugs");

/* GET users listing. */
router.get("/", getBugs);
router.get("/user/:id", getBugsByUser);
router.post("/create", createBug);
router.delete("/delete/:id", deleteBug);
router.get("/:id", getBug);
router.put("/:id", updateBug);

module.exports = router;
