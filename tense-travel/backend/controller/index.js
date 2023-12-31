const {
  login,
  register,
  checkUserByMobile,
} = require("../controller/auth.controller");

const {
  getAllEra: findAllEra,
  getAllEraItsPercentage,
  resetUserRecentStage,
  updateSessionEndTimeInUserAnswer,
  resetStage,
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
  updateQuestions
} = require("../controller/questionBank.controller");

const {
  findUserEra,
  userAttendingQuestion,
  userRetryStage,
  getUserCurrentEra,
  getCurrentUserAndSessionId,
  eraseUserStageAttempts,
  userHighStarsStagesOfEra,
  updateExplanationStatusInUserAnsweredQuestion
} = require("../controller/userAnswerEra.controller");

const {
  getUserScore,
  recentStageCompletedScore,
  getInCompletedStages
} = require("../controller/score.controller");
const { getUserCoins, buyLives } = require("../controller/coin.controller");
const {
  getTourStatus,
  updateTourStatus,
  shareGameSessionDetail,
  getAllUsers,
} = require("../controller/user.controller");
const {
  getEraAnswerAllHistory,
  getEraAnswerHistoryByUserId,
} = require("../controller/userAnswerEraHistory.controller");

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
  resetStage,
  getAllUsers,
  getEraAnswerAllHistory,
  getEraAnswerHistoryByUserId,
  getInCompletedStages,
  updateQuestions,
  updateExplanationStatusInUserAnsweredQuestion
};
