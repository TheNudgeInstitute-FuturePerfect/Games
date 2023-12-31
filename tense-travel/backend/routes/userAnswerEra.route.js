const express = require("express");
const {
  findUserEra,
  userAttendingQuestion,
  userRetryStage,
  getUserCurrentEra,
  getCurrentUserAndSessionId,
  eraseUserStageAttempts,
  userHighStarsStagesOfEra,
  updateExplanationStatusInUserAnsweredQuestion,
} = require("../controller/index");
const {
  userRetryStageValidator,
  getUserCurrentEraValidator,
  userHighStarsStageOfEraValidator,
  updateAnswerExplanationValidator,
} = require("../modules/validators/userAnswerEraValidator");

const router = express.Router();
router.post("/find-user-era", findUserEra);
router.post("/user-attending-question", userAttendingQuestion);
router.post("/user-retry-stage", [userRetryStageValidator], userRetryStage);
router.post(
  "/get-user-current-era",
  [getUserCurrentEraValidator],
  getUserCurrentEra
);
router.get("/get-user-and-sessionid", getCurrentUserAndSessionId);
router.delete("/erase-user-stage-attempts/:id", eraseUserStageAttempts);
router.post(
  "/user-high-stars-stages-of-era",
  [userHighStarsStageOfEraValidator],
  userHighStarsStagesOfEra
);

router.patch(
  "/update-explanation-in-answered-question/:id",
  [updateAnswerExplanationValidator],
  updateExplanationStatusInUserAnsweredQuestion
);

exports.router = router;
