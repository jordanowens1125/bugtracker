const express = require('express');
const router = express.Router();
const {getBugs,createBug,deleteBug,getBug,deleteProjectBugs,updateBug,
    unAssignUserFromBugs,} = require('../controllers/bugs')
/* GET users listing. */
router.get('/', getBugs);
router.post('/create', createBug);
router.delete('/delete/:id', deleteBug);
router.put('/unassignuser',unAssignUserFromBugs)
router.get('/:id', getBug);
router.put('/:id',updateBug)
router.delete('/delete/project/:projectid',deleteProjectBugs)
module.exports = router;
