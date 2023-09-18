const express = require("express");
const {
  findUserEra,
  userAttendingQuestion,
  userRetryStage,
  getUserCurrentEra
} = require("../controller/index");
const {
  userRetryStageValidator, getUserCurrentEraValidator,
} = require("../modules/validators/userAnswerEraValidator");

const router = express.Router();
router.post("/find-user-era", findUserEra);
router.post("/user-attending-question", userAttendingQuestion);
router.post("/user-retry-stage", [userRetryStageValidator], userRetryStage);
router.post("/get-user-current-era", [getUserCurrentEraValidator], getUserCurrentEra);

exports.router = router;
