const express = require("express");
const router = express.Router();

const { persist } = require("../controllers/persist");

router.get("/", persist);

module.exports = router;
