const isEmpty = require("lodash.isempty");
const { questoinBankModel, userAnswerEraModel } = require("../models/index");
const { reponseModel, errorHandler } = require("../utils/responseHandler");
const httpStatusCodes = require("../utils/httpStatusCodes");
const {
  getLivesOfUnlockStage,
} = require("./global-services/filterEraSatage.service");
const {
  stageFilter,
  stageQuestionSize,
  answerResponseFormat,
} = require("../utils/constants/payloadInterface/payload.interface");
const ObjectID = require("mongodb").ObjectId;

exports.create = async (req, res, next) => {
  try {
    const payload = req.body["questions"];
    let checkDuplicateQuestion;
    let duplicateQuestionAnswer = {};

    for await (let que of payload) {
      const checkWord = await questoinBankModel.findOne({
        word: { $regex: new RegExp("^" + que["word"], "i") },
        question: { $regex: new RegExp("^" + que["question"], "i") },
        stageId: que?.stageId,
      });
      if (!isEmpty(checkWord)) {
        checkDuplicateQuestion = checkWord;
        duplicateQuestionAnswer = que;
        break;
      }
    }

    if (!isEmpty(checkDuplicateQuestion)) {
      checkDuplicateQuestion = duplicateQuestionAnswer;
      return reponseModel(
        httpStatusCodes.OK,
        "Word and question is already exists",
        false,
        checkDuplicateQuestion,
        req,
        res
      );
    } else {
      const questionCreated = await questoinBankModel.insertMany(payload);

      return reponseModel(
        httpStatusCodes.OK,
        "Question created",
        true,
        "",
        req,
        res
      );
    }
  } catch (err) {
    next(err);
  }
};

exports.getWords = async (req, res, next) => {
  try {
    let words = await questoinBankModel
      .find(
        { status: "active" },
        {
          _id: 1,
          word: 1,
        }
      )
      .distinct("word");

    return reponseModel(
      httpStatusCodes.OK,
      words.length > 0 ? "Word found" : "Word not found",
      words.length > 0 ? true : false,
      words,
      req,
      res
    );
  } catch (err) {
    next(err);
  }
};

exports.getQuestionByWord = async (req, res, next) => {
  try {
    const word = req.params.word;
    let questions = await questoinBankModel.find({
      word: word,
    });

    return reponseModel(
      httpStatusCodes.OK,
      questions.length > 0 ? "Quesiton found" : "Quesiton not found",
      questions.length > 0 ? true : false,
      questions,
      req,
      res
    );
  } catch (err) {
    next(err);
  }
};

/* stage level questions by stage id */
exports.getRandomQuestionByStage = async (req, res, next) => {
  try {
    const stageId = req.params.stageId;
    let questions = await questoinBankModel.aggregate([
      {
        $match: {
          stageId: new ObjectID(stageId),
        },
      },
      {
        $sample: {
          size: 10,
        },
      },
    ]);

    return reponseModel(
      httpStatusCodes.OK,
      questions.length > 0 ? "Quesiton found" : "Quesiton not found",
      questions.length > 0 ? true : false,
      questions,
      req,
      res
    );
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const payload = req.body;
    const questionPayload = payload["answers"].map(async (question, index) => {
      const updated = await questoinBankModel.findOneAndUpdate(
        { _id: question._id },
        {
          question: payload["question"],
          status: payload["status"],
          level: question.level,
          description: question.description,
          answer: question.answer,
          explanation: question.explanation,
        },
        { upsert: true }
      );
    });

    return reponseModel(
      httpStatusCodes.OK,
      "Updated success",
      true,
      "",
      req,
      res
    );
  } catch (err) {
    next(err);
  }
};

/* boss level questions by era id */
exports.getRandomQuestionByEra = async (req, res, next) => {
  try {
    const eraId = req.params.tenseEraId;
    let questions = await questoinBankModel.aggregate([
      {
        $match: {
          tenseEraId: new ObjectID(eraId),
        },
      },
      {
        $sample: {
          size: 10,
        },
      },
    ]);

    return reponseModel(
      httpStatusCodes.OK,
      questions.length > 0 ? "Quesiton found" : "Quesiton not found",
      questions.length > 0 ? true : false,
      questions,
      req,
      res
    );
  } catch (err) {
    next(err);
  }
};

exports.getQuestionDetails = async (req, res, next) => {
  try {
    const id = req.params.id;
    let questions = await questoinBankModel.findOne(
      {
        _id: id,
      },
      {
        _id: 1,
        question: 1,
        answer: 1,
        word: 1,
        tenseEraTitle: 1,
        tenseEraId: 1,
        stageTitle: 1,
        stageId: 1,
        level: 1,
        description: 1,
        status: 1,
        explanation: 1,
      }
    );

    return reponseModel(
      httpStatusCodes.OK,
      !isEmpty(questions) ? "Quesiton found" : "Quesiton not found",
      !isEmpty(questions) ? true : false,
      questions,
      req,
      res
    );
  } catch (err) {
    next(err);
  }
};

exports.getRandomQuestionByUnlockStage = async (req, res, next) => {
  try {
    const requestBody = req.body;
    const checkUnlockStage = await getLivesOfUnlockStage(
      userAnswerEraModel,
      requestBody
    );

    let stage;
    let questionSize = stageQuestionSize.size;
    let questions;
    let attemptedQuestionArray;
    let attemptedQuestionsIds;
    let attemptedQuestionArrayModified;
    let attemptedQuestionArrayLength = 0;

    if (isEmpty(checkUnlockStage)) {
      return reponseModel(
        httpStatusCodes.OK,
        "Stage is locked",
        false,
        [],
        req,
        res
      );
    } else if (
      !isEmpty(checkUnlockStage) &&
      checkUnlockStage[0]["tenseEra"][0]["stage"][0]["question"].length > 0
    ) {
      attemptedQuestionArray =
        checkUnlockStage[0]["tenseEra"][0]["stage"][0]["question"];

      questionSize = parseInt(
        stageQuestionSize.size - attemptedQuestionArray.length
      );

      attemptedQuestionArrayLength = attemptedQuestionArray.length;

      attemptedQuestionsIds = attemptedQuestionArray.map(
        (question) => question.questionBankId
      );

      attemptedQuestionArrayModified = attemptedQuestionArray.map(
        (question) => {
          return {
            ...question,
            _id: question.questionBankId,
          };
        }
      );

      questions = await questoinBankModel.aggregate([
        {
          $match: {
            stageId: new ObjectID(requestBody["stageId"]),
            status: { $eq: "active" },
            _id: {
              $nin: attemptedQuestionsIds,
            },
          },
        },
        {
          $sample: {
            size: questionSize,
          },
        },
      ]);

      attemptedQuestionArray = [
        ...attemptedQuestionArrayModified,
        ...questions,
      ];

      questions = attemptedQuestionArray;
    } else {
      req.params.stageId = requestBody["stageId"];
      questions = await this.getRandomQuestionByStage(req, res, next);
      questions = questions["data"];
    }

    stage = stageFilter({
      answerCount: checkUnlockStage[0],
      requestBody: requestBody,
    });

    //checking if user attempts ten questions
    if (attemptedQuestionArrayLength >= 10) {
      answerResponseFormat.completedStage = true;
    }
    // answerResponseFormat.heartLive = stage["lives"]

    return reponseModel(
      httpStatusCodes.OK,
      !isEmpty(questions) ? "Quesiton found" : "Quesiton not found",
      !isEmpty(questions) ? true : false,
      { questions, ...answerResponseFormat, heartLive: stage["lives"] },
      req,
      res
    );
  } catch (err) {
    next(err);
  }
};

exports.updateQuestionStatus = async (req, res, next) => {
  try {
    const payload = req.body;
    const id = req.params.id;
    const updated = await questoinBankModel.findOneAndUpdate(
      { _id: id },
      {
        status: payload["status"],
      },
      { upsert: true }
    );

    return reponseModel(
      httpStatusCodes.OK,
      "Status updated",
      true,
      "",
      req,
      res
    );
  } catch (err) {
    next(err);
  }
};
