const express = require("express");
const router = express.Router();

const {loginUser, signUp} = require('../controllers/auth')

//login
router.post("/login", loginUser);

//signup
router.post("/signup", signUp);

module.exports = router;