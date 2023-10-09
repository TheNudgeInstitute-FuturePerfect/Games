const express = require("express");
const {
  getUserScore,
  recentStageCompletedScore,
} = require("../controller/index");
const {
  getUserScoreValidator,
  recentStageCompletedScoreValidator,
} = require("../modules/validators/getUserScoreValidator");

const router = express.Router();
router.post("/get-user-score", [getUserScoreValidator], getUserScore);
router.post(
  "/recent-stage-completed-score",
  [recentStageCompletedScoreValidator],
  recentStageCompletedScore
);

exports.router = router;
