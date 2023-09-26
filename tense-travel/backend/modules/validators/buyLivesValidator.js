const Joi = require("joi");
const errorHandler = require("../../utils/responseHandler");
const httpStatusCodes = require("../../utils/httpStatusCodes");

/* get user score validator */
const userObj = {
  userId: Joi.string().required(),
  sessionId: Joi.string().required(),
  tenseEraId: Joi.string().required(),
  stageId: Joi.string().required(),
};

const userSchema = Joi.object(userObj);
userSchema.validate({});

const buyLivesValidator = async (req, res, next) => {
  try {
    let payload = req.body;
    await userSchema.validateAsync(payload);
    next();
  } catch (error) {
    const errMsg = error["details"][0]?.message || "";
    errorHandler.handle(httpStatusCodes.BAD_REQUEST, errMsg, false, req, res);
  }
};

module.exports = {
  buyLivesValidator,
};
