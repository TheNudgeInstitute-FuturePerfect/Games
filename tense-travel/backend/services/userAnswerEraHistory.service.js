const { isEmpty } = require("lodash");
const httpStatusCodes = require("../utils/httpStatusCodes");
const { reponseModel } = require("../utils/responseHandler");
const {
  userAnswerEraHistoryModel,
} = require("../models/userAnswerEraHistory.model");

exports.getEraAnswerAllHistory = async (req, res, next) => {
  try {
    let answerHistoriesData = await userAnswerEraHistoryModel.find(
      {},
      {
        _id: 1,
        userAnswerEraId: 1,
        userId: 1,
        sessionId: 1,
        tenseEraId: 1,
        stageId: 1,
        earnStars: 1,
        earnGerms: 1,
        eraEarnGerms: 1,
        stage: 1,
        questions: 1,
        completedEra: 1,
        startTime: 1,
        endTime: 1,
        createdAt: 1,
        updatedAt: 1,
      }
    );

    return reponseModel(
      httpStatusCodes.OK,
      !isEmpty(answerHistoriesData) ? "History founds" : "No history found",
      !isEmpty(answerHistoriesData) ? true : false,
      answerHistoriesData,
      req,
      res
    );
  } catch (err) {
    next(err);
  }
};

exports.getEraAnswerHistoryByUserId = async (req, res, next) => {
  try {
    const userId = req.params["userId"];
    let answerHistoriesData = await userAnswerEraHistoryModel.find(
      { userId },
      {
        _id: 1,
        userAnswerEraId: 1,
        userId: 1,
        sessionId: 1,
        tenseEraId: 1,
        stageId: 1,
        earnStars: 1,
        earnGerms: 1,
        eraEarnGerms: 1,
        stage: 1,
        questions: 1,
        completedEra: 1,
        startTime: 1,
        endTime: 1,
        createdAt: 1,
        updatedAt: 1,
      }
    );

    return reponseModel(
      httpStatusCodes.OK,
      !isEmpty(answerHistoriesData) ? "History founds" : "No history found",
      !isEmpty(answerHistoriesData) ? true : false,
      answerHistoriesData,
      req,
      res
    );
  } catch (err) {
    next(err);
  }
};
