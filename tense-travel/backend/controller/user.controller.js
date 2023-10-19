const { getTourStatus, updateTourStatus } = require("../services/user.service");
const { handleSuccess } = require("../utils/responseHandler");

exports.getTourStatus = async (req, res, next) => {
  const tourInfo = await getTourStatus(req, res, next);
  handleSuccess(tourInfo, req, res);
};

exports.updateTourStatus = async (req, res, next) => {
  console.log('controller');
  const response = await updateTourStatus(req, res, next);
  console.log('response', response);
  handleSuccess(response, req, res);
};
