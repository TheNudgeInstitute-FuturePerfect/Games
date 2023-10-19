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

module.exports = {
  userTourGuideValidator,
};
