const { login, register } = require("../controller/auth.controller");
const {
  create: createProfileRole,
  findAll: findAllRoles,
  findOne: findOneById,
  update: updateRole,
  deleteRole,
} = require("../controller/profileRole.controller");
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
} = require("../controller/questionBank.controller");

const {
  findUserEra,
  userAttendingQuestion,
  userRetryStage,
  getUserCurrentEra,
} = require("../controller/userAnswerEra.controller");

module.exports = {
  login,
  register,
  createProfileRole,
  findAllRoles,
  findOneById,
  updateRole,
  deleteRole,
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
};
