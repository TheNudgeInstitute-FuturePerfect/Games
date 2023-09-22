const express = require("express");
const {
  findUserEra,
  userAttendingQuestion,
  userRetryStage,
  getUserCurrentEra,
  getCurrentUserAndSessionId,
  eraseUserStageAttempts
} = require("../controller/index");
const {
  userRetryStageValidator, getUserCurrentEraValidator,
} = require("../modules/validators/userAnswerEraValidator");

const router = express.Router();
router.post("/find-user-era", findUserEra);
router.post("/user-attending-question", userAttendingQuestion);
router.post("/user-retry-stage", [userRetryStageValidator], userRetryStage);
router.post("/get-user-current-era", [getUserCurrentEraValidator], getUserCurrentEra);
router.get("/get-user-and-sessionid", getCurrentUserAndSessionId);
router.delete("/erase-user-stage-attempts/:id", eraseUserStageAttempts);



exports.router = router;
