const {
  create,
  findAll,
  findOne,
  update,
  deleteRole,
} = require("../services/profileRole.service");
const { handleSuccess } = require("../utils/responseHandler");

exports.create = async (req, res, next) => {
  const response = await create(req.body, req, res, next);
  handleSuccess(response, req, res);
};

exports.findAll = async (req, res, next) => {
  const response = await findAll(req, res, next);
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
