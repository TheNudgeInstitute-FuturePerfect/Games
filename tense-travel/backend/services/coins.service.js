const {
  eraTenseModel,
  userModel,
  userAnswerEraModel,
} = require("../models/index");
const { reponseModel } = require("../utils/responseHandler");
const httpStatusCodes = require("../utils/httpStatusCodes");
const isEmpty = require("lodash.isempty");
const {
  getUserDetails,
  getLivesOfUnlockStage,
} = require("./global-services/filterEraSatage.service");
const {
  stageFilter,
  eraFilter,
  earningCoinsRule,
  answerResponseFormat,
  userAnswerEraHisotryPayload,
} = require("../utils/constants/payloadInterface/payload.interface");
const { buyLives } = require("./answer/retryAttempt");
const { getRandomQuestions } = require("./userAnswerEra.service");
const { getRandomQuestionByStage } = require("./questionBank.service");
const {
  userAnswerEraHistoryModel,
} = require("../models/userAnswerEraHistory.model");

exports.getUserCoins = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    let userDetails = await getUserDetails(userModel, userId);

    return reponseModel(
      httpStatusCodes.OK,
      !isEmpty(userDetails) ? "User coins found" : "User coins not found",
      !isEmpty(userDetails) ? true : false,
      userDetails,
      req,
      res
    );
  } catch (err) {
    next(err);
  }
};

exports.buyLives = async (req, res, next) => {
  try {
    const requestBody = req.body;
    userAnswerEraHisotryPayload.userAnswerEraId = "";
    userAnswerEraHisotryPayload.userId = "";
    userAnswerEraHisotryPayload.sessionId = "";
    userAnswerEraHisotryPayload.tenseEraId = "";
    userAnswerEraHisotryPayload.stageId = "";
    userAnswerEraHisotryPayload.earnStars = "";
    userAnswerEraHisotryPayload.earnGerms = "";
    userAnswerEraHisotryPayload.stage = {};
    userAnswerEraHisotryPayload.questions = [];
    userAnswerEraHisotryPayload.startTime = "";
    userAnswerEraHisotryPayload.endTime = "";

    let tenseStageDetail = await getLivesOfUnlockStage(
      userAnswerEraModel,
      requestBody
    );

    if (!isEmpty(tenseStageDetail)) {
      let eraCoins;
      let totalEarnGerms;
      const stage = stageFilter({
        answerCount: tenseStageDetail[0],
        requestBody,
      });
      const eraDetail = eraFilter({
        tenseEra: tenseStageDetail[0]["tenseEra"],
        requestBody,
      });

      if (stage["lives"] >= 1) {
        return reponseModel(
          httpStatusCodes.OK,
          `Please do not try to purchase lives! You have still ${stage["lives"]} lives. Continue with the game`,
          false,
          [],
          req,
          res
        );
      } else if (stage["isLivePurchased"] === true) {
        return reponseModel(
          httpStatusCodes.OK,
          `Purchasing is not allowed! Earlier, you had purchased one life. Please retry playing the game.`,
          false,
          [],
          req,
          res
        );
      } else {
        const userDetail = await getUserDetails(
          userModel,
          requestBody["userId"]
        );
        if (
          !isEmpty(userDetail) &&
          userDetail["totalEarnGerms"] >= earningCoinsRule?.buyLives?.coin
        ) {
          //preparing user Answer Era Hisotry Payload
          userAnswerEraHisotryPayload.userAnswerEraId =
            tenseStageDetail[0]["_id"];
          userAnswerEraHisotryPayload.userId = requestBody["userId"];
          userAnswerEraHisotryPayload.sessionId = requestBody["sessionId"];
          userAnswerEraHisotryPayload.tenseEraId = requestBody["tenseEraId"];
          userAnswerEraHisotryPayload.stageId = requestBody["stageId"];
          userAnswerEraHisotryPayload.earnStars = stage["earnStars"];
          userAnswerEraHisotryPayload.earnGerms = stage["earnGerms"];
          userAnswerEraHisotryPayload.questions = stage["question"];
          userAnswerEraHisotryPayload.startTime = stage["startTime"];
          userAnswerEraHisotryPayload.endTime = stage["endTime"];

          delete stage["histories"];
          delete stage["_id"];

          userAnswerEraHisotryPayload.stage = stage;
          userAnswerEraHisotryPayload.stage["tenseEraId"] =
            requestBody["tenseEraId"];
          delete userAnswerEraHisotryPayload["stage"]["question"];

          totalEarnGerms =
            userDetail["totalEarnGerms"] - earningCoinsRule?.buyLives?.coin;
          if (eraDetail?.earnGerms >= earningCoinsRule?.buyLives?.coin) {
            eraCoins = eraDetail?.earnGerms - earningCoinsRule?.buyLives?.coin;
          }
          userGermsPayload = { totalEarnGerms, eraCoins };

          const buyLive = await buyLives(
            {
              userAnswerModel: userAnswerEraModel,
              userModel: userModel,
              userAnswerHistoryModel: userAnswerEraHistoryModel,
            },
            stage,
            userGermsPayload,
            userAnswerEraHisotryPayload,
            requestBody,
            next
          );

          if (buyLive?.modifiedCount > 0 && buyLive?.acknowledged === true) {
            return reponseModel(
              httpStatusCodes.OK,
              "Lives have been purchased successfully.",
              true,
              {},
              req,
              res
            );
          } else {
            return reponseModel(
              httpStatusCodes.OK,
              "Lives purchased have not been successfully.",
              false,
              {},
              req,
              res
            );
          }
        } else {
          return reponseModel(
            httpStatusCodes.OK,
            `Sorry! You do not have sufficient coins to purchase the lives. Please play other stages to earn the coins.`,
            false,
            [],
            req,
            res
          );
        }
      }
    } else {
      return reponseModel(
        httpStatusCodes.OK,
        `Stage is locked.`,
        false,
        [],
        req,
        res
      );
    }
  } catch (err) {
    next(err);
  }
};
