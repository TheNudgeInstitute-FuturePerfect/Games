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

module.exports = { getUserCurrentEra, getStageQuestion, userAnswerSubmitPayload };
