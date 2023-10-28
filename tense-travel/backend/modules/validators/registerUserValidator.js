const Joi = require("joi");
const errorHandler = require("../../utils/responseHandler");
const httpStatusCodes = require("../../utils/httpStatusCodes");

/* get user score validator */
const userRegisterObj = {
  firstName: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
};

const userRegisterSchema = Joi.object(userRegisterObj);
userRegisterSchema.validate({});

const userRegisterValidator = async (req, res, next) => {
  try {
    let payload = req.body;
    await userRegisterSchema.validateAsync(payload);
    next();
  } catch (error) {
    const errMsg = error["details"][0]?.message || "";
    errorHandler.handle(httpStatusCodes.BAD_REQUEST, errMsg, false, req, res);
  }
};

/* check user mobile number validator */
const userMobileNumberObj = {
  mobileNumber: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),
};

const userMobileNumberSchema = Joi.object(userMobileNumberObj);
userMobileNumberSchema.validate({});

const userMobileNumberValidator = async (req, res, next) => {
  try {
    let payload = req.body;
    await userMobileNumberSchema.validateAsync(payload);
    next();
  } catch (error) {
    const errMsg = error["details"][0]?.message || "";
    errorHandler.handle(httpStatusCodes.BAD_REQUEST, errMsg, false, req, res);
  }
};

module.exports = {
  userRegisterValidator,
  userMobileNumberValidator,
};
