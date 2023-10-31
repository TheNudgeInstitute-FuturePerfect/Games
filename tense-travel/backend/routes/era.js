const express = require("express");
const {
  findAllEra,
  getAllEraItsPercentage,
  resetUserRecentStage,
  updateSessionEndTimeInUserAnswer,
  resetStage,
} = require("../controller/index");
const {
  userRecentStageCompletedValidator,
  updateSessionEndTimeInUserAnswerValidator,
  resetStageValidator,
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
router.post(
  "/reset-stage",
  [resetStageValidator],
  resetStage
);

exports.router = router;
