const {
  getUserScore,
  recentStageCompletedScore,
  getInCompletedStages,
} = require("../services/score.service");
const { handleSuccess } = require("../utils/responseHandler");

exports.getUserScore = async (req, res, next) => {
  const response = await getUserScore(req, res, next);
  handleSuccess(response, req, res);
};

exports.recentStageCompletedScore = async (req, res, next) => {
  const response = await recentStageCompletedScore(req, res, next);
  handleSuccess(response, req, res);
};

exports.getInCompletedStages = async (req, res, next) => {
  const response = await getInCompletedStages(req, res, next);
  handleSuccess(response, req, res);
};
