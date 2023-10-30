const express = require("express");
const {
  findAllEra,
  getAllEraItsPercentage,
  resetUserRecentStage,
  updateSessionEndTimeInUserAnswer,
} = require("../controller/index");
const {
  userRecentStageCompletedValidator,
  updateSessionEndTimeInUserAnswerValidator,
} = require("../modules/validators/tenseEraValidator");

const router = express.Router();
router.get("/all-eras", findAllEra);
router.post("/all-era-its-percentage", getAllEraItsPercentage);
router.post(
  "/reset-user-recent-stage",
  [userRecentStageCompletedValidator],
  resetUserRecentStage
);
router.post(
  "/reset-user-recent-stage",
  [updateSessionEndTimeInUserAnswerValidator],
  updateSessionEndTimeInUserAnswer
);

exports.router = router;
