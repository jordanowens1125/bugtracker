const express = require("express");
const router = express.Router();
const {
  getUsers,
  findOrCreateUser,
  deleteUser,
  getUser,
  updateUser,
  assignUserToProject,
  unAssignBugFromUser,
  unAssignUsersFromProject,
  unAssignUserFromProject,
  assignBugToUser,
} = require("../controllers/users");

/* GET users listing. */
router.get("/", getUsers);
router.post("/findorcreate", findOrCreateUser);
router.delete("/delete/:id", deleteUser);
router.put("/project/:id", assignUserToProject);
router.put("/removeproject", unAssignUsersFromProject);
router.put("/assignbugtouser/:id", assignBugToUser);
router.put("/unassignbugfromuser/:id", unAssignBugFromUser);
router.put("/unassignuserfromproject", unAssignUserFromProject);
router.get("/:id", getUser);
router.put("/:id", updateUser);

module.exports = router;
