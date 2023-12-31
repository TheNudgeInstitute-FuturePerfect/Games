const Joi = require("joi");
const errorHandler = require("../../utils/responseHandler");
const httpStatusCodes = require("../../utils/httpStatusCodes");
const ObjectId = require("mongoose").Types.ObjectId;

const userStageRetryObj = {
  userId: Joi.string().required(),
  sessionId: Joi.string().required(),
  tenseEraId: Joi.string().required(),
  stageId: Joi.string().required(),
};

const userStageRetrySchema = Joi.object(userStageRetryObj);
userStageRetrySchema.validate({});

const userRetryStageValidator = async (req, res, next) => {
  try {
    let payload = req.body;
    await userStageRetrySchema.validateAsync(payload, { abortEarly: false });
    next();
  } catch (error) {
    const errMsg = error["details"][0]?.message || "";
    errorHandler.handle(httpStatusCodes.BAD_REQUEST, errMsg, false, req, res);
  }
};

/*question answer payload*/
const userAnswerObj = {
  questionId: Joi.string().required(),
  userId: Joi.string().required(),
  sessionId: Joi.string().required(),
  tenseEraId: Joi.string().required(),
  stageId: Joi.string().required(),
  question: Joi.string().required(),
  userAnswer: Joi.string().required(),
};

const userAnswerSchema = Joi.object(userAnswerObj);
userAnswerSchema.validate({});

const userAnswerValidator = async (req, res, next) => {
  try {
    let payload = req.body;
    await userAnswerSchema.validateAsync(payload, { abortEarly: false });
    next();
  } catch (error) {
    const errMsg = error["details"][0]?.message || "";
    errorHandler.handle(httpStatusCodes.BAD_REQUEST, errMsg, false, req, res);
  }
};

/*get user current era*/
const userCurrentEraObj = {
  userId: Joi.string().required(),
  sessionId: Joi.string().required(),
  tenseEraId: Joi.string().required(),
};

const userCurrentEraSchema = Joi.object(userCurrentEraObj);
userCurrentEraSchema.validate({});

const getUserCurrentEraValidator = async (req, res, next) => {
  try {
    let payload = req.body;
    await userCurrentEraSchema.validateAsync(payload, { abortEarly: false });
    next();
  } catch (error) {
    const errMsg = error["details"][0]?.message || "";
    errorHandler.handle(httpStatusCodes.BAD_REQUEST, errMsg, false, req, res);
  }
};

/*user highest stars stage of era validator*/
const highStarsStageObj = {
  userId: Joi.string().required(),
  sessionId: Joi.string().optional().allow(null),
  tenseEraId: Joi.string().required(),
};

const highStarsStageSchema = Joi.object(highStarsStageObj);
highStarsStageSchema.validate({});

const userHighStarsStageOfEraValidator = async (req, res, next) => {
  try {
    let payload = req.body;
    await highStarsStageSchema.validateAsync(payload, { abortEarly: false });
    next();
  } catch (error) {
    const errMsg = error["details"][0]?.message || "";
    errorHandler.handle(httpStatusCodes.BAD_REQUEST, errMsg, false, req, res);
  }
};

/* update explanation in user attended questions */
const updateAnswerExplanationObj = {
  questionId: Joi.string()
    .custom((value, helper) => {
      if (ObjectId.isValid(value)) {
        if (String(new ObjectId(value)) === value) {
          return true;
        }
        return helper.message(`\"questionId\" is not a valid ID`);
      }
      return helper.message(`\"questionId\" is not a valid ID`);
    })
    .required(),
  userId: Joi.string()
    .custom((value, helper) => {
      if (ObjectId.isValid(value)) {
        if (String(new ObjectId(value)) === value) {
          return true;
        }
        return helper.message(`\"userId\" is not a valid ID`);
      }
      return helper.message(`\"userId\" is not a valid ID`);
    })
    .required(),
  tenseEraId: Joi.string()
    .custom((value, helper) => {
      if (ObjectId.isValid(value)) {
        if (String(new ObjectId(value)) === value) {
          return true;
        }
        return helper.message(`\"tenseEraId\" is not a valid ID`);
      }
      return helper.message(`\"tenseEraId\" is not a valid ID`);
    })
    .required(),
  stageId: Joi.string()
    .custom((value, helper) => {
      if (ObjectId.isValid(value)) {
        if (String(new ObjectId(value)) === value) {
          return true;
        }
        return helper.message(`\"stageId\" is not a valid ID`);
      }
      return helper.message(`\"stageId\" is not a valid ID`);
    })
    .required(),
  isExplanation: Joi.boolean().required(),
  sessionId: Joi.string().required(),
};

const updateAnswerExplanationSchema = Joi.object(updateAnswerExplanationObj);
updateAnswerExplanationSchema.validate({});

const updateAnswerExplanationValidator = async (req, res, next) => {
  try {
    let payload = req.body;
    await updateAnswerExplanationSchema.validateAsync(payload, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    const errMsg = error["details"][0]?.message || "";
    errorHandler.handle(httpStatusCodes.BAD_REQUEST, errMsg, false, req, res);
  }
};
/* update explanation in user attended questions end */

module.exports = {
  userRetryStageValidator,
  userAnswerValidator,
  getUserCurrentEraValidator,
  userHighStarsStageOfEraValidator,
  updateAnswerExplanationValidator,
};
