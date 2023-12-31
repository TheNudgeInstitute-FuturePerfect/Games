const Joi = require("joi");
const errorHandler = require("../../utils/responseHandler");
const httpStatusCodes = require("../../utils/httpStatusCodes");

/* get user score validator */
const userScoreObj = {
  userId: Joi.string().required(),
  sessionId: Joi.string().required(),
};

const userScoreSchema = Joi.object(userScoreObj);
userScoreSchema.validate({});

const getUserScoreValidator = async (req, res, next) => {
  try {
    let payload = req.body;
    await userScoreSchema.validateAsync(payload);
    next();
  } catch (error) {
    const errMsg = error["details"][0]?.message || "";
    errorHandler.handle(httpStatusCodes.BAD_REQUEST, errMsg, false, req, res);
  }
};

/* get user recent stage completed score */
const recentStageObj = {
  userId: Joi.string().required(),
  sessionId: Joi.string().required(),
  tenseEraId: Joi.string().required(),
  stageId: Joi.string().required(),
};

const recentStageSchema = Joi.object(recentStageObj);
recentStageSchema.validate({});

const recentStageCompletedScoreValidator = async (req, res, next) => {
  try {
    let payload = req.body;
    await recentStageSchema.validateAsync(payload);
    next();
  } catch (error) {
    const errMsg = error["details"][0]?.message || "";
    errorHandler.handle(httpStatusCodes.BAD_REQUEST, errMsg, false, req, res);
  }
};

module.exports = {
  getUserScoreValidator,
  recentStageCompletedScoreValidator,
};
