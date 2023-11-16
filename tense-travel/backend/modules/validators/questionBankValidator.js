const Joi = require("joi");
const errorHandler = require("../../utils/responseHandler");
const httpStatusCodes = require("../../utils/httpStatusCodes");
const ObjectId = require("mongoose").Types.ObjectId;

const questions = Joi.object().keys({
  tenseEraId: Joi.string().required(),
  stageId: Joi.string().required(),
  answer: Joi.string().required(),
  tenseEraTitle: Joi.string().optional().allow("", null),
  stageTitle: Joi.string().optional().allow("", null),
  explanation: Joi.string().optional().allow("", null),
  status: Joi.string().valid("active", "inactive", "deleted").required(),
  word: Joi.string().required(),
  question: Joi.string()
    .custom((value, helper) => {
      if (!value.includes(" __ ")) {
        return helper.message(`\"question\" is not in valid format`);
      }
    })
    .required(),
});
const questionObj = {
  questions: Joi.array().items(questions).min(9).required(),
};

const questionSchema = Joi.object(questionObj);
questionSchema.validate({});

const addQuestionValidator = async (req, res, next) => {
  try {
    let payload = req.body;
    await questionSchema.validateAsync(
      {
        questions: payload["questions"],
      },
      { abortEarly: false }
    );
    next();
  } catch (error) {
    const errMsg = error["details"][0]?.message || "";
    errorHandler.handle(httpStatusCodes.BAD_REQUEST, errMsg, false, req, res);
  }
};

/* update question */
const updateAnswers = Joi.object().keys({
  _id: Joi.string().required(),
  tenseEraId: Joi.string().required(),
  stageId: Joi.string().required(),
  answer: Joi.string().required(),
  tenseEraTitle: Joi.string().optional().allow("", null),
  // stageTitle: Joi.string().optional().allow("", null),
  stageTitle: Joi.string().required(),
  explanation: Joi.string().optional().allow("", null),
  level: Joi.string().optional().allow("", null),
  description: Joi.string().optional().allow("", null),
});
const updateQuestionObj = {
  word: Joi.string().required(),
  question: Joi.string()
    .custom((value, helper) => {
      if (!value.includes(" __ ")) {
        return helper.message(`\"question\" is not in valid format`);
      }
    })
    .required(),
  answers: Joi.array().items(updateAnswers).min(9).required(),
  status: Joi.string().valid("active", "inactive", "deleted").required(),
};

const updateQuestionSchema = Joi.object(updateQuestionObj);
updateQuestionSchema.validate({});

const updateQuestionValidator = async (req, res, next) => {
  try {
    let payload = req.body;
    await updateQuestionSchema.validateAsync(
      {
        word: payload["word"],
        question: payload["question"],
        answers: payload["answers"],
        status: payload["status"],
      },
      { abortEarly: false }
    );
    next();
  } catch (error) {
    const errMsg = error["details"][0]?.message || "";
    errorHandler.handle(httpStatusCodes.BAD_REQUEST, errMsg, false, req, res);
  }
};

/* update question status */
const questionStatusObj = {
  status: Joi.string().valid("active", "inactive", "deleted").required(),
};

const questionStatusSchema = Joi.object(questionStatusObj);
questionStatusSchema.validate({});

const updateQuestionStatusValidator = async (req, res, next) => {
  try {
    let payload = req.body;
    await questionStatusSchema.validateAsync(
      {
        status: payload["status"],
      },
      { abortEarly: false }
    );
    next();
  } catch (error) {
    const errMsg = error["details"][0]?.message || "";
    errorHandler.handle(httpStatusCodes.BAD_REQUEST, errMsg, false, req, res);
  }
};
/* update question status end */

/* update one question */
const updateOneQuestionObj = {
  question: Joi.string(),
  answer: Joi.string(),
  explanation: Joi.string(),
  status: Joi.string(),
};

const updateOneQuestionSchema = Joi.object(updateOneQuestionObj);
updateOneQuestionSchema.validate({});

const updateOneQuestionValidator = async (req, res, next) => {
  try {
    let payload = req.body;
    await updateOneQuestionSchema.validateAsync(
      {
        question: payload["question"],
        answer: payload["answer"],
        explanation: payload["explanation"],
        status: payload["status"],
      },
      { abortEarly: false }
    );
    next();
  } catch (error) {
    const errMsg = error["details"][0]?.message || "";
    errorHandler.handle(httpStatusCodes.BAD_REQUEST, errMsg, false, req, res);
  }
};
/* update one question end */

/* update multiple questions */
const updateQuestions = Joi.object().keys({
  _id: Joi.string()
    .custom((value, helper) => {
      if (ObjectId.isValid(value)) {
        if (String(new ObjectId(value)) === value) {
          return true;
        }
        return helper.message(`\"_id\" is not a valid MongodbID`);
      }
      return helper.message(`\"_id\" is not a valid MongodbID`);
    })
    .required(),
  answer: Joi.string().optional().allow("", null),
  explanation: Joi.string().optional().allow("", null),
  status: Joi.string().valid("active", "inactive", "deleted"),
  question: Joi.string().custom((value, helper) => {
    if (!value.includes(" __ ")) {
      return helper.message(
        `\"question\" is not in valid format! Question must be contained __`
      );
    }
  }),
});
const updateQuestionsObj = {
  questions: Joi.array().items(updateQuestions).max(100),
};

const updateQuestionsSchema = Joi.object(updateQuestionsObj);
updateQuestionsSchema.validate({});

const updateQuestionsValidator = async (req, res, next) => {
  try {
    let payload = req.body;
    await updateQuestionsSchema.validateAsync(
      {
        questions: payload,
      },
      { abortEarly: false }
    );
    next();
  } catch (error) {
    const errMsg = error["details"][0]?.message || "";
    errorHandler.handle(httpStatusCodes.BAD_REQUEST, errMsg, false, req, res);
  }
};
/* update multiple questions end */

module.exports = {
  addQuestionValidator,
  updateQuestionValidator,
  updateQuestionStatusValidator,
  updateOneQuestionValidator,
  updateQuestionsValidator,
};
