const {
  getTourStatus,
  updateTourStatus,
  getUserCompletedLevels,
} = require("../services/user.service");
const { handleSuccess } = require("../utils/responseHandler");

exports.getTourStatus = async (req, res, next) => {
  const tourInfo = await getTourStatus(req, res, next);
  handleSuccess(tourInfo, req, res);
};

exports.updateTourStatus = async (req, res, next) => {
  const response = await updateTourStatus(req, res, next);
  handleSuccess(response, req, res);
};

exports.getUserCompletedLevels = async (req, res, next) => {
  const response = await getUserCompletedLevels(req, res, next);
  handleSuccess(response, req, res);
};
