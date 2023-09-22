const { getUserScore } = require("../services/score.service");
const { handleSuccess } = require("../utils/responseHandler");

exports.getUserScore = async (req, res, next) => {
  const response = await getUserScore(req, res, next);
  handleSuccess(response, req, res);
};
