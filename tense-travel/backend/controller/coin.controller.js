const {
  getUserCoins, buyLives
} = require("../services/coins.service");
const { handleSuccess } = require("../utils/responseHandler");

exports.getUserCoins = async (req, res, next) => {
  const response = await getUserCoins(req, res, next);
  handleSuccess(response, req, res);
};

exports.buyLives = async (req, res, next) => {
  const response = await buyLives(req, res, next);
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
