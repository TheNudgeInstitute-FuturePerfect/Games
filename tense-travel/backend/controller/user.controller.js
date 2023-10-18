const { getTourStatus } = require("../services/user.service");
const { handleSuccess } = require("../utils/responseHandler");

exports.getTourStatus = async (req, res, next) => {
  const tourInfo = await getTourStatus(req, res, next);
  handleSuccess(tourInfo, req, res);
};
