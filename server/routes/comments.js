const express = require('express');
const router = express.Router();
const {getComments,createComment,deleteComment,getComment,
  updateComment,deleteBugComments,
} = require('../controllers/comments')

/* GET users listing. */
router.get('/', getComments);
router.post('/create', createComment);
router.delete('/:id', deleteComment);
router.get('/:id', getComment);
router.put('/:id', updateComment);
router.delete('/delete/bug/:bugid',deleteBugComments)
module.exports = router;
