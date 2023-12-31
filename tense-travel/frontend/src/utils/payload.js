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
  isExplanation: false,
};

const reTryStagePaylod = {
  userId: "",
  sessionId: "",
  tenseEraId: "",
  stageId: "",
};

const userSubmitAnswerResponse = {
  completedEra: false,
  completedStage: null,
  nextQuestion: false,
  heartLive: 0,
  isCorrect: false,
  isError: false,
  isGameOver: null,
  message: "",
};

const buyLivesPaylod = {
  userId: "",
  sessionId: "",
  tenseEraId: "",
  stageId: "",
};

const API_ERROR_ESPONSE = {
  message: "",
  success: null,
};

const updateUserTourStatusPayload = {
  userId: "",
  sessionId: "",
  tourGuideStep: "",
  tourGuide: "",
};

const shareGameSessionDetailPayload = {
  Mobile: "",
  Type: "",
  SessionID: "",
  SessionStartTime: "",
  SessionEndTime: "",
  SessionComplete: "",
  TimeSpent: "",
};

const stageSessionEndTimeDetail = {
  SessionEndTime: "",
  SessionComplete: "",
  TimeSpent: "",
};

module.exports = {
  getUserCurrentEra,
  getStageQuestion,
  userAnswerSubmitPayload,
  reTryStagePaylod,
  userSubmitAnswerResponse,
  buyLivesPaylod,
  API_ERROR_ESPONSE,
  updateUserTourStatusPayload,
  shareGameSessionDetailPayload,
  stageSessionEndTimeDetail,
};
