const {
  getEraAnswerAllHistory,
  getEraAnswerHistoryByUserId,
} = require("../services/userAnswerEraHistory.service");
const { handleSuccess } = require("../utils/responseHandler");

exports.getEraAnswerAllHistory = async (req, res, next) => {
  const response = await getEraAnswerAllHistory(req, res, next);
  handleSuccess(response, req, res);
};

exports.getEraAnswerHistoryByUserId = async (req, res, next) => {
  const response = await getEraAnswerHistoryByUserId(req, res, next);
  handleSuccess(response, req, res);
};
