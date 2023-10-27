const Joi = require("joi");
const errorHandler = require("../../utils/responseHandler");
const httpStatusCodes = require("../../utils/httpStatusCodes");

/* get user recent stage completed score */
const userRecentStageObj = {
  userId: Joi.string().required(),
  sessionId: Joi.string().optional().allow(null),
  tenseEraId: Joi.string().required(),
  stageId: Joi.string().required(),
};

const userRecentStageSchema = Joi.object(userRecentStageObj);
userRecentStageSchema.validate({});

const userRecentStageCompletedValidator = async (req, res, next) => {
  try {
    let payload = req.body;
    await userRecentStageSchema.validateAsync(payload);
    next();
  } catch (error) {
    const errMsg = error["details"][0]?.message || "";
    errorHandler.handle(httpStatusCodes.BAD_REQUEST, errMsg, false, req, res);
  }
};

module.exports = {
  userRecentStageCompletedValidator,
};
