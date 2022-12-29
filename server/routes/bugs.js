const express = require('express');
const router = express.Router();
const {getBugs,createBug,deleteBug,getBug,deleteProjectBugs,updateBug,
    unAssignUserFromBugs,addCommentToBug} = require('../controllers/bugs')
/* GET users listing. */
router.get('/', getBugs);
router.post('/create', createBug);
router.delete('/delete/:id', deleteBug);
router.put('/unassignuser',unAssignUserFromBugs)
router.put('/addcomment',addCommentToBug)
router.delete('/delete/project/:projectid',deleteProjectBugs)
router.get('/:id', getBug);
router.put('/:id',updateBug)

module.exports = router;
