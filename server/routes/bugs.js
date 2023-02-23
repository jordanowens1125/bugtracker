const express = require("express");
const router = express.Router();
const {
  getBugs,
  createBug,
  deleteBug,
  getBug,
  updateBug,
} = require("../controllers/bugs");

/* GET users listing. */
router.get("/", getBugs);
router.post("/create", createBug);
router.delete("/delete/:id", deleteBug);
router.get("/:id", getBug);
router.put("/:id", updateBug);

module.exports = router;
