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
} = require("../utils/constants/payloadInterface/payload.interface");
const { buyLives } = require("./answer/retryAttempt");
const { getRandomQuestions } = require("./userAnswerEra.service");
const { getRandomQuestionByStage } = require("./questionBank.service");

exports.getUserCoins = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    let userDetails = await getUserDetails(userModel, userId);

    if (!isEmpty(userDetails)) {
      return reponseModel(
        httpStatusCodes.OK,
        !isEmpty(userDetails) ? "User details found" : "User details not found",
        !isEmpty(userDetails) ? true : false,
        userDetails,
        req,
        res
      );
    }
  } catch (err) {
    next(err);
  }
};

exports.buyLives = async (req, res, next) => {
  try {
    const requestBody = req.body;
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
      } else {
        const userDetail = await getUserDetails(
          userModel,
          requestBody["userId"]
        );
        if (!isEmpty(userDetail) && userDetail["totalEarnGerms"] >= 5) {
          delete stage["histories"];
          delete stage["_id"];
          totalEarnGerms =
            userDetail["totalEarnGerms"] - earningCoinsRule?.buyLives?.coin;
          if (eraDetail?.earnGerms >= 5) {
            eraCoins = eraDetail?.earnGerms - earningCoinsRule?.buyLives?.coin;
          }
          userGermsPayload = { totalEarnGerms, eraCoins };
          const buyLive = await buyLives(
            { userAnswerModel: userAnswerEraModel, userModel: userModel },
            stage,
            userGermsPayload,
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
            `Sorry! You do not have sufficient coins to purchase the lives.`,
            false,
            [],
            req,
            res
          );
        }
      }
    } else {
    }
  } catch (err) {
    next(err);
  }
};
