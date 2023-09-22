const express = require("express");
const { getUserScore } = require("../controller/index");
const {
  getUserScoreValidator,
} = require("../modules/validators/getUserScoreValidator");

const router = express.Router();
router.post("/get-user-score", [getUserScoreValidator], getUserScore);

exports.router = router;
