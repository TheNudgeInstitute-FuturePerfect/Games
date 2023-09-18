const express = require("express");
const { login, register } = require("../controller//index");

const router = express.Router();

router.
post("/register", register).
post("/login", login);

exports.router = router;
