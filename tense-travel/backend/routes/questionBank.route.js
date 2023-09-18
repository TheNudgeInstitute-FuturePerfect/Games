const express = require("express");
const {
  findAllEra,
  findAllQuestion,
  createQuestion,
  getWords,
  getQuestionByWord,
  getRandomQuestionByStage,
  updateQuestion,
  getRandomQuestionByEra,
  getRandomQuestionByUnlockStage,
} = require("../controller/index");
const {
  addQuestionValidator,
  updateQuestionValidator,
} = require("../modules/validators/questionBankValidator");
const {
  userRetryStageValidator,
} = require("../modules/validators/userAnswerEraValidator");

const router = express.Router();
router.get("/questions", findAllQuestion);
router.post("/question", [addQuestionValidator], createQuestion);
router.get("/get-words", getWords);
router.get("/get-question-by-word/:word", getQuestionByWord);
router.get("/get-stage-question/:stageId", getRandomQuestionByStage);
router.put("/update-question/:word", [updateQuestionValidator], updateQuestion);
router.get("/get-boss-question/:tenseEraId", getRandomQuestionByEra);
router.post(
  "/get-random-question-byunlock-stage",
  [userRetryStageValidator],
  getRandomQuestionByUnlockStage
);

exports.router = router;
