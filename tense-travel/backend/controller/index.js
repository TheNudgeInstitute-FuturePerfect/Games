const { login, register, checkUserByMobile } = require("../controller/auth.controller");

const {
  getAllEra: findAllEra,
  getAllEraItsPercentage,
  resetUserRecentStage,
  updateSessionEndTimeInUserAnswer,
  resetStage
} = require("../controller/tenseEra.controller");

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
  userHighStarsStagesOfEra
} = require("../controller/userAnswerEra.controller");

const {
  getUserScore,
  recentStageCompletedScore,
} = require("../controller/score.controller");
const { getUserCoins, buyLives } = require("../controller/coin.controller");
const {
  getTourStatus,
  updateTourStatus,
  shareGameSessionDetail
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
  getAllEraItsPercentage,
  userHighStarsStagesOfEra,
  resetUserRecentStage,
  checkUserByMobile,
  shareGameSessionDetail,
  updateSessionEndTimeInUserAnswer,
  resetStage
};
