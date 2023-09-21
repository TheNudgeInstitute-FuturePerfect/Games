const {
  findUserEra,
  findOne,
  update,
  userAttendingQuestion,
  userRetryStage,
  getUserCurrentEra,
  getCurrentUserAndSessionId,
  eraseUserStageAttempts,
} = require("../services/userAnswerEra.service");
const { handleSuccess } = require("../utils/responseHandler");

/**
 *
 * @param {
 *  requestBody: {
 *  "userId": "",
 *  "sessionId": "",
 *  "tenseEraId":""
 * }
 *  } req
 * @param {*} res
 * @param {*} next
 */
exports.findUserEra = async (req, res, next) => {
  const response = await findUserEra(req, res, next);
  handleSuccess(response, req, res);
};

exports.findOne = async (req, res, next) => {
  const response = await findOne(req, res, next);
  handleSuccess(response, req, res);
};

exports.update = async (req, res, next) => {
  const response = await update(req, res, next);
  handleSuccess(response, req, res);
};

/**
 *
 * @param {
 *  requestBody: {
 *{
 *  "questionId": "",
 *  "userId": "",
 *  "sessionId": "",
 *  "tenseEraId": "",
 *  "stageId": "",
 *  "question": "",
 *  "userAnswer": ""
 *}
 * }
 *  } req
 * @param {*} res
 * @param {*} next
 */
exports.userAttendingQuestion = async (req, res, next) => {
  const response = await userAttendingQuestion(req, res, next);
  handleSuccess(response, req, res);
};

/**
 *
 * @param {
*  requestBody: {
  *{
  *  "userId": "",
  *  "sessionId": "",
  *  "tenseEraId": "",
  *  "stageId": ""
  *}
  * }
  *  } req
  * @param {*} res
  * @param {*} next
  */
 exports.userRetryStage = async (req, res, next) => {
   const response = await userRetryStage(req, res, next);
   handleSuccess(response, req, res);
 };

 /**
 *
 * @param {
 *  requestBody: {
 *  "userId": "",
 *  "sessionId": "",
 *  "tenseEraId":""
 * }
 *  } req
 * @param {*} res
 * @param {*} next
 */
exports.getUserCurrentEra = async (req, res, next) => {
  const response = await getUserCurrentEra(req, res, next);
  handleSuccess(response, req, res);
};

exports.getCurrentUserAndSessionId = async (req, res, next) => {
  const response = await getCurrentUserAndSessionId(req, res, next);
  handleSuccess(response, req, res);
};

exports.eraseUserStageAttempts = async (req, res, next) => {
  const response = await eraseUserStageAttempts(req, res, next);
  handleSuccess(response, req, res);
};
