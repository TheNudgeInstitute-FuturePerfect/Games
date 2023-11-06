const express = require("express");
const {
  getUserScore,
  recentStageCompletedScore,
  getInCompletedStages
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

router.get(
  "/get-incompleted-stages",
  getInCompletedStages
);

exports.router = router;
