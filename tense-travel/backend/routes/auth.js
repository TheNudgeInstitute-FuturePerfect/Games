const express = require("express");
const { login, register, checkUserByMobile } = require("../controller");
const {
  userRegisterValidator,
  userMobileNumberValidator,
} = require("../modules/validators/registerUserValidator");

const router = express.Router();

router
  .post("/register", [userRegisterValidator], register)
  .post("/login", login)
  .post("/check-user-bymobile", [userMobileNumberValidator], checkUserByMobile);

exports.router = router;
