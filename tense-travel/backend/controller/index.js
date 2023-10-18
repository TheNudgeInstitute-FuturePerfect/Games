const { login, register } = require("../controller/auth.controller");
const { getAllEra: findAllEra } = require("../controller/tenseEra.controller");
const {
  create: createQuestion,
  find: findAllQuestion,
  update: updateQuestion,
  getWords,
  getQuestionByWord,
  getRandomQuestionByStage,
  getRandomQuestionByEra,
  getRandomQuestionByUnlockStage,
  updateQuestionStatus,
  updateOneQuestion,
} = require("../controller/questionBank.controller");

const {
  findUserEra,
  userAttendingQuestion,
  userRetryStage,
  getUserCurrentEra,
  getCurrentUserAndSessionId,
  eraseUserStageAttempts,
} = require("../controller/userAnswerEra.controller");

const {
  getUserScore,
  recentStageCompletedScore,
} = require("../controller/score.controller");
const { getUserCoins, buyLives } = require("../controller/coin.controller");
const {
  getTourStatus,
  updateTourStatus,
} = require("../controller/user.controller");

module.exports = {
  login,
  register,
  findAllEra,
  createQuestion,
  findAllQuestion,
  updateQuestion,
  getWords,
  getQuestionByWord,
  getRandomQuestionByStage,
  findUserEra,
  getRandomQuestionByEra,
  userAttendingQuestion,
  userRetryStage,
  getUserCurrentEra,
  getRandomQuestionByUnlockStage,
  updateQuestionStatus,
  getCurrentUserAndSessionId,
  eraseUserStageAttempts,
  getUserScore,
  updateOneQuestion,
  getUserCoins,
  buyLives,
  recentStageCompletedScore,
  getTourStatus,
  updateTourStatus,
};
