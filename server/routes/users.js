const express = require('express');
const router = express.Router();
const {getUsers,createUser,deleteUser,getUser,  
    updateUser,addUserToProject, assignBugToUser,
    unAssignBugFromUser,addUserComment,removeUserComment,
    deleteUserFromProject,addUsersToProject,unAssignUsersFromProject} = require('../controllers/users')

/* GET users listing. */
router.get('/', getUsers);
router.post('/create', createUser);
router.delete('/delete/:id', deleteUser);
router.put('/project/:projectid',addUsersToProject)
router.put('/removeproject/',unAssignUsersFromProject)
router.put('/unassignbugfromuser',unAssignBugFromUser)
router.put('/assignbugtouser/:id/:bugid',assignBugToUser)
router.put('/addusercomment',addUserComment)
router.get('/:id', getUser);
router.put('/:id',updateUser)
router.put('/:id/:projectid',addUserToProject)
router.put('/:id/deleteuser/:projectid',deleteUserFromProject)
//router.put('/:id/:commentid',addUserComment)
router.put('/:id/deletecomment/:commentid',removeUserComment)


module.exports = router;
