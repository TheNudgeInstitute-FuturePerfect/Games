const {
  create,
  update,
  getWords,
  getQuestionByWord,
  getRandomQuestionByStage,
  getRandomQuestionByEra,
  getRandomQuestionByUnlockStage,
  updateQuestionStatus,
  updateOneQuestion,
  find
} = require("../services/questionBank.service");
const { handleSuccess } = require("../utils/responseHandler");

exports.create = async (req, res, next) => {
  const response = await create(req, res, next);
  handleSuccess(response, req, res);
};

exports.find = async (req, res, next) => {
  const response = await find(req, res, next);
  handleSuccess(response, req, res);
};

exports.getWords = async (req, res, next) => {
  const response = await getWords(req, res, next);
  handleSuccess(response, req, res);
};

exports.getQuestionByWord = async (req, res, next) => {
  const response = await getQuestionByWord(req, res, next);
  handleSuccess(response, req, res);
};

/**
 * stage level questions
 * @param {stageId} req
 * @param {} res
 * @param {} next
 */
exports.getRandomQuestionByStage = async (req, res, next) => {
  const response = await getRandomQuestionByStage(req, res, next);
  handleSuccess(response, req, res);
};

exports.update = async (req, res, next) => {
  const response = await update(req, res, next);
  handleSuccess(response, req, res);
};

/**
 * boss level questions
 * @param {tenseEraId} req
 * @param {} res
 * @param {} next
 */
exports.getRandomQuestionByEra = async (req, res, next) => {
  const response = await getRandomQuestionByEra(req, res, next);
  handleSuccess(response, req, res);
};

/**
 * @param {tenseEraId} req
 * @param {} res
 * @param {} next
 */
exports.getRandomQuestionByUnlockStage = async (req, res, next) => {
  const response = await getRandomQuestionByUnlockStage(req, res, next);
  handleSuccess(response, req, res);
};

/**
 * @Method PATCH
 * @param {id}
 * @Payload {
 * status: 'active
 * }
 */
exports.updateQuestionStatus = async (req, res, next) => {
  const response = await updateQuestionStatus(req, res, next);
  handleSuccess(response, req, res);
};

/**
 * @Method PATCH
 * @param {id}
 * @Payload {
 * status: 'active
 * }
 */
exports.updateOneQuestion = async (req, res, next) => {
  const response = await updateOneQuestion(req, res, next);
  handleSuccess(response, req, res);
};