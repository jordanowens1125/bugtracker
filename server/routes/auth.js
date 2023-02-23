const express = require("express");
const router = express.Router();

const {loginUser, signUpUser} = require('../controllers/auth')

//login route
router.post('/login',loginUser)


//signup route
router.post("/signup", signUpUser);


module.exports = router;