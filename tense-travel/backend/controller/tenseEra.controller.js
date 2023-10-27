const {
  create,
  getAllEra,
  findOne,
  update,
  deleteRole,
  getAllEraItsPercentage,
  resetRecentUserStage,
  resetUserRecentStage,
} = require("../services/tenseEra.service");
const { handleSuccess } = require("../utils/responseHandler");

exports.getAllEra = async (req, res, next) => {
  const response = await getAllEra(req, res, next);
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

exports.deleteRole = async (req, res, next) => {
  const response = await deleteRole (req, res, next);
  handleSuccess(response, req, res);
};

exports.getAllEraItsPercentage = async (req, res, next) => {
  const response = await getAllEraItsPercentage(req, res, next);
  handleSuccess(response, req, res);
};

exports.resetUserRecentStage = async (req, res, next) => {
  console.log('call');
  const response = await resetUserRecentStage(req, res, next);
  handleSuccess(response, req, res);
};