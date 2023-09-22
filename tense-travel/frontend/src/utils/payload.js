const getUserCurrentEra = {
  userId: "",
  sessionId: "",
  tenseEraId: "",
};

const getStageQuestion = {
  userId: "",
  sessionId: "",
  tenseEraId: "",
  stageId: "",
};

const userAnswerSubmitPayload = {
  questionId: "",
  userId: "",
  sessionId: "",
  tenseEraId: "",
  stageId: "",
  question: " ",
  userAnswer: "",
};

const reTryStagePaylod = {
  userId: "",
  sessionId: "",
  tenseEraId: "",
  stageId: "",
};

module.exports = { getUserCurrentEra, getStageQuestion, userAnswerSubmitPayload, reTryStagePaylod };
