const express = require('express');
const router = express.Router();
const {getProjects, createProject, deleteProject, 
    getProject,updateProject,addBugToProject,addCommentToProject,
    deleteBugFromProject,removeUserFromProjects} = require('../controllers/projects')

/* GET project listings. */
router.get('/', getProjects);
router.post('/create', createProject);
router.delete('/delete/:id', deleteProject);
router.put('/removeuser',removeUserFromProjects)
router.get('/:id', getProject);
router.put('/:id',updateProject)
router.put('/:id/addnewbug',addBugToProject)
router.put('/:id/addnewcomment',addCommentToProject)
router.put('/:id/deletebug/:bugid',deleteBugFromProject)


module.exports = router;
