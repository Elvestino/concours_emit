const express = require("express");
const router = express.Router();
const {login} = require("../controllers/administarateurController");

router.post("/login", login)

module.exports = router;