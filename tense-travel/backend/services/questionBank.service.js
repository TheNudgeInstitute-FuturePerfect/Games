const isEmpty = require("lodash.isempty");
const { questoinBankModel, userAnswerEraModel } = require("../models/index");
const { reponseModel, errorHandler } = require("../utils/responseHandler");
const httpStatusCodes = require("../utils/httpStatusCodes");
const {
  getLivesOfUnlockStage,
} = require("./global-services/filterEraSatage.service");
const {
  stageFilter,
} = require("../utils/constants/payloadInterface/payload.interface");
const ObjectID = require("mongodb").ObjectId;

exports.create = async (req, res, next) => {
  try {
    const payload = req.body;

    let checkWord = await questoinBankModel.findOne({
      word: { $regex: new RegExp("^" + payload["word"], "i") },
      question: payload["question"],
    });

    if (!isEmpty(checkWord)) {
      return reponseModel(
        httpStatusCodes.OK,
        "Word and question is already exists",
        false,
        "",
        req,
        res
      );
    } else {
      const questionPayload = payload["answers"].map((item, index) => {
        return { ...item, question: payload.question, word: payload.word };
      });
      const questionCreated = await questoinBankModel.insertMany(
        questionPayload
      );

      return reponseModel(
        httpStatusCodes.OK,
        "Word and question created",
        true,
        questionCreated,
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

exports.getRandomQuestionByUnlockStage = async (req, res, next) => {
  try {
    const requestBody = req.body;
    const checkUnlockStage = await getLivesOfUnlockStage(
      userAnswerEraModel,
      requestBody
    );

    console.log(checkUnlockStage)

    if (isEmpty(checkUnlockStage)) {
      return reponseModel(
        httpStatusCodes.OK,
        "Stage is locked",
        false,
        [],
        req,
        res
      );
    } else {
      const stage = stageFilter({
        answerCount: checkUnlockStage[0],
        requestBody: requestBody,
      });

      req.params.stageId = requestBody["stageId"];
      let questions = await this.getRandomQuestionByStage(req, res, next);
      questions = questions["data"];

      return reponseModel(
        httpStatusCodes.OK,
        questions.length > 0 ? "Quesiton found" : "Quesiton not found",
        questions.length > 0 ? true : false,
        { questions, heartLive: stage["lives"] },
        req,
        res
      );
    }
  } catch (err) {
    next(err);
  }
};
