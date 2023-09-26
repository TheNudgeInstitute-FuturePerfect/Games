const express = require("express");
const { login, register } = require("../controller//index");
const {
  userRegisterValidator,
} = require("../modules/validators/registerUserValidator");

const router = express.Router();

router
  .post("/register", [userRegisterValidator], register)
  .post("/login", login);

exports.router = router;
