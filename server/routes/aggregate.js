const express = require("express");
const router = express.Router();

const {
    getAll
} = require("../controllers/aggregate")

router.get('/', getAll)

module.exports = router;
