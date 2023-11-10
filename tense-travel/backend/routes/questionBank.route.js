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
  updateQuestionStatus,
  updateOneQuestion,
  updateQuestions,
} = require("../controller/index");
const {
  addQuestionValidator,
  updateQuestionValidator,
  updateQuestionStatusValidator,
  updateOneQuestionValidator,
  updateQuestionsValidator,
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
router.patch(
  "/update-question-status/:id",
  [updateQuestionStatusValidator],
  updateQuestionStatus
);

router.patch(
  "/update-one-question/:id",
  [updateOneQuestionValidator],
  updateOneQuestion
);

router.post(
  "/update-questions",
  [updateQuestionsValidator],
  updateQuestions
);

exports.router = router;
