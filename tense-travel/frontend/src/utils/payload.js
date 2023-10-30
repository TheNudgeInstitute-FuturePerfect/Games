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

const setStorage = (data) => {
  const storageData = getStorage();
  const updatedData = { ...storageData, ...data };
  data = JSON.stringify(updatedData);
  sessionStorage.setItem("tesne-travel", data);
};

const getStorage = () => {
  const storageData = sessionStorage.getItem("tesne-travel");
  if (!storageData) {
    return "";
  } else return JSON.parse(storageData);
};
const removeStorage = () => {
  sessionStorage.removeItem("tesne-travel");
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

module.exports = {
  getUserCurrentEra,
  getStageQuestion,
  userAnswerSubmitPayload,
  reTryStagePaylod,
  userSubmitAnswerResponse,
  buyLivesPaylod,
  API_ERROR_ESPONSE,
  updateUserTourStatusPayload,
  setStorage,
  getStorage,
  removeStorage,
  shareGameSessionDetailPayload
};
