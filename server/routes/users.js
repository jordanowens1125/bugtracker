const express = require("express");
const router = express.Router();
const {
  getUsers,
  deleteUser,
  getUser,
  updateUser,
  assignUserToProject,
  unAssignBugFromUser,
  unAssignUsersFromProject,
  unAssignUserFromProject,
  assignBugToUser,
  signUp,
  updateRoles,
  loginUser,
  deleteUsers,
  getPM,
  getAdmin,
} = require("../controllers/users");

/* GET users listing. */
router.get("/", getUsers);
//login
router.post("/login", loginUser);

//signup
router.post("/signup", signUp);

//require auth
const requireAuth = require("../middleware/requireAuth");
router.use(requireAuth);

router.delete("/delete", deleteUsers);
router.delete("/delete/:id", deleteUser);
router.put("/project/:id", assignUserToProject);
router.get("/projectmanager/:id", getPM);
router.get("/admin", getAdmin);
router.put("/removeproject", unAssignUsersFromProject);
router.put("/assignbugtouser/:id", assignBugToUser);
router.put("/unassignbugfromuser/:id", unAssignBugFromUser);
router.put("/unassignuserfromproject", unAssignUserFromProject);
router.put("/updateroles", updateRoles);
router.get("/:id", getUser);
router.put("/:id", updateUser);

module.exports = router;
