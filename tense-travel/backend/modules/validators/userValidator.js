const Joi = require("joi");
const errorHandler = require("../../utils/responseHandler");
const httpStatusCodes = require("../../utils/httpStatusCodes");

/* get user score validator */
const userTourGuideObj = {
  userId: Joi.string().required(),
  sessionId: Joi.string().optional().allow(""),
  tourGuideStep: Joi.number().required(),
  tourGuide: Joi.boolean().required(),
};

const userTourGuideSchema = Joi.object(userTourGuideObj);
userTourGuideSchema.validate({});

const userTourGuideValidator = async (req, res, next) => {
  try {
    let payload = req.body;
    await userTourGuideSchema.validateAsync(payload);
    next();
  } catch (error) {
    const errMsg = error["details"][0]?.message || "";
    errorHandler.handle(httpStatusCodes.BAD_REQUEST, errMsg, false, req, res);
  }
};

/* share game session and times */
const gameSessionObj = {
  Mobile: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),
  Type: Joi.string().required(),
  SessionID: Joi.string().required(),
  SessionStartTime: Joi.string().required(),
  SessionEndTime: Joi.string().optional().allow(""),
  SessionComplete: Joi.string().optional().allow(""),
  TimeSpent: Joi.string().optional().allow(""),
};

const gameSessionSchema = Joi.object(gameSessionObj);
gameSessionSchema.validate({});

const shareGameSessionDetailValidator = async (req, res, next) => {
  try {
    let payload = req.body;
    await gameSessionSchema.validateAsync(payload);
    next();
  } catch (error) {
    const errMsg = error["details"][0]?.message || "";
    errorHandler.handle(httpStatusCodes.BAD_REQUEST, errMsg, false, req, res);
  }
};

module.exports = {
  userTourGuideValidator,
  shareGameSessionDetailValidator,
};
