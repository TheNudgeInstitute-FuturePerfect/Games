const {
  userAnswerEraModel,
  questoinBankModel,
  userModel,
} = require("../models/index");
const { reponseModel } = require("../utils/responseHandler");
const httpStatusCodes = require("../utils/httpStatusCodes");
const isEmpty = require("lodash.isempty");
const { findEra } = require("./tenseEra.service");
const {
  getRandomQuestionByStage,
  getRandomQuestionByEra,
  getQuestionDetails,
} = require("./questionBank.service");
const {
  answerPayload,
  stageFilter,
  earnCoins,
  answerResponseFormat,
  eraFilter,
  userAnswerStages,
  stageQuestionSize,
  earningCoinsRule,
  userAnswerEraHisotryPayload,
} = require("../utils/constants/payloadInterface/payload.interface");
const {
  retryGame,
  unlockStage,
  createUserEraAnswerHistory,
} = require("./answer/retryAttempt");
const {
  filterStage,
  getGermsDetails,
  getUserDetails,
  updateUserDetails,
  checkAttendingQuestionIsAnswered,
  getRecentUserAnswerDetail,
  getLivesOfUnlockStage,
} = require("./global-services/filterEraSatage.service");
const { updateCoin } = require("./answer/coinsCalculation");
const {
  userAnswerEraHistoryModel,
} = require("../models/userAnswerEraHistory.model");
const ObjectID = require("mongodb").ObjectId;
const {
  userAnswerEraHisotryPayloadReset,
  userAnswerEraHisotryPayloadPrepare,
} = require("../utils/resetPayload");

exports.findUserEra = async (req, res, next) => {
  try {
    const requestBody = req.body;
    req.params["id"] = requestBody["tenseEraId"];
    let userEras = await userAnswerEraModel.findOne({
      userId: requestBody["userId"],
      sessionId: requestBody["sessionId"],
    });

    if (!isEmpty(userEras)) {
      const questions = await getRandomQuestions(req, res, next);

      return reponseModel(
        httpStatusCodes.OK,
        questions ? "Question found" : "Question not found",
        questions ? true : false,
        questions["data"],
        req,
        res
      );
    } else {
      let eraStages = await findEra(req, res, next);
      const tenseEraTitle = eraStages["data"]?.title;
      eraStages = eraStages["data"]["stage"];
      const eraStagesPayload = eraStages.map((stage, indx) => {
        return {
          stageId: stage._id,
          sequence: stage.sequence,
          stageTitle: stage.title,
        };
      });

      const tenseEraPayload = {
        tenseEraId: requestBody["tenseEraId"],
        tenseEraTitle,
        attempt: 1,
        stage: eraStagesPayload,
      };
      const createUserEras = await new userAnswerEraModel({
        userId: requestBody["userId"],
        tenseEra: tenseEraPayload,
        sessionId: requestBody["sessionId"],
      });
      await createUserEras.save();

      const questions = await getRandomQuestions(req, res, next);
      return reponseModel(
        httpStatusCodes.OK,
        questions ? "Era found" : "Era not found",
        questions ? true : false,
        questions["data"],
        req,
        res
      );
    }
  } catch (err) {
    next(err);
  }
};

exports.userAttendingQuestion = async (req, res, next) => {
  try {
    const requestBody = req.body;
    let stages = {};

    answerResponseFormat.completedEra = false;
    answerResponseFormat.completedStage = false;
    answerResponseFormat.nextQuestion = false;
    answerResponseFormat.isGameOver = false;

    req.params["id"] = req.body["questionId"];
    let questionDetail = await getQuestionDetails(req, res, next);
    questionDetail = questionDetail["data"];

    let userAnswerStage = await userAnswerStages(
      userAnswerEraModel,
      requestBody
    );
    stages["lives"] = parseInt(
      userAnswerStage[0]["tenseEra"][0]["stage"][0]["lives"]
    );
    stages["isLivePurchased"] =
      userAnswerStage[0]["tenseEra"][0]["stage"][0]["isLivePurchased"];
    answerResponseFormat.isLivePurchased = stages["isLivePurchased"];

    let answerExists = await checkAttendingQuestionIsAnswered(
      userAnswerEraModel,
      requestBody
    );

    if (
      (!isEmpty(answerExists) &&
        answerExists[0]["tenseEra"][0]["stage"][0]["lives"] <= 0) ||
      stages["lives"] <= 0
    ) {
      answerResponseFormat.heartLive = !isEmpty(answerExists)
        ? answerExists[0]["tenseEra"][0]["stage"][0]["lives"]
        : stages["lives"];
      answerResponseFormat.completedEra = false;
      answerResponseFormat.completedStage = false;
      answerResponseFormat.nextQuestion = false;
      answerResponseFormat.isGameOver = true;

      return reponseModel(
        httpStatusCodes.OK,
        "Game is over. Unfortunately, you have given three incorrect answers! You can buy lives or replay the game.",
        false,
        { answerResponseFormat },
        req,
        res
      );
    } else if (
      !isEmpty(answerExists) &&
      answerExists[0]["tenseEra"][0]["stage"][0]["question"]?.length >=
        stageQuestionSize.size
    ) {
      answerResponseFormat.completedEra = false;
      answerResponseFormat.completedStage = true;
      answerResponseFormat.isGameOver = false;
      return reponseModel(
        httpStatusCodes.OK,
        "Stage has already been completed",
        false,
        { answerResponseFormat },
        req,
        res
      );
    } else if (!isEmpty(answerExists)) {
      stages["lives"] = parseInt(
        answerExists[0]["tenseEra"][0]["stage"][0]["lives"]
      );
      answerResponseFormat.nextQuestion = true;
      answerResponseFormat.isCorrect = null;
      answerResponseFormat.heartLive = stages["lives"];
      answerResponseFormat.isGameOver = false;

      return reponseModel(
        httpStatusCodes.OK,
        "Answer has already been saved",
        false,
        { answerResponseFormat },
        req,
        res
      );
    } else {
      //preparing payload to be saved
      // let userAnswerStage = await userAnswerStages(
      //   userAnswerEraModel,
      //   requestBody
      // );
      answerPayload.question = questionDetail.question;
      answerPayload.answer = questionDetail.answer;
      answerPayload.userAnswer = requestBody.userAnswer;
      answerPayload.questionBankId = requestBody.questionId;

      stages["attemptQuestions"] = parseInt(
        userAnswerStage[0]["tenseEra"][0]["stage"][0]["attemptQuestions"]
      );
      stages["attemptQuestions"]++;

      stages["lives"] = parseInt(
        userAnswerStage[0]["tenseEra"][0]["stage"][0]["lives"]
      );

      stages["numberOfCorrect"] = parseInt(
        userAnswerStage[0]["tenseEra"][0]["stage"][0]["numberOfCorrect"]
      );
      stages["numberOfInCorrect"] = parseInt(
        userAnswerStage[0]["tenseEra"][0]["stage"][0]["numberOfInCorrect"]
      );

      //checking the answer is correct or incorrect
      if (
        requestBody["userAnswer"].toLocaleLowerCase().trim() ===
        questionDetail["answer"].toLocaleLowerCase().trim()
      ) {
        answerPayload.isCorrect = true;
        stages["numberOfCorrect"]++;
        answerResponseFormat.isCorrect = true;
        answerResponseFormat.heartLive = stages["lives"];
      } else {
        answerPayload.isCorrect = false;
        stages["numberOfInCorrect"]++;
        stages["lives"]--;
        answerResponseFormat.heartLive = stages["lives"];
        answerResponseFormat.isCorrect = false;
      }
      //save user answer of the question
      const savedUserAnswer = await userAnswerEraModel.updateOne(
        {
          userId: new ObjectID(requestBody["userId"]),
          sessionId: requestBody["sessionId"],
          tenseEra: {
            $elemMatch: {
              tenseEraId: new ObjectID(requestBody["tenseEraId"]),
              stage: {
                $elemMatch: {
                  stageId: new ObjectID(requestBody["stageId"]),
                },
              },
            },
          },
        },
        {
          $push: {
            "tenseEra.$[].stage.$[coins].question": answerPayload,
          },
        },
        {
          arrayFilters: [
            {
              "coins.stageId": requestBody["stageId"],
            },
          ],
        }
      );

      if (
        savedUserAnswer?.modifiedCount > 0 &&
        savedUserAnswer?.acknowledged === true
      ) {
        //stage update(nextQuestion, numberOfInCorrect, numberOfCorrect, attemptQuestions, lives)
        const updateCounts = await userAnswerEraModel.updateOne(
          {
            userId: requestBody["userId"],
            sessionId: requestBody["sessionId"],
            "tenseEra.tenseEraId": requestBody["tenseEraId"],
            "tenseEra.stage.stageId": requestBody["stageId"],
            "tenseEra.stage.question.questionBankId": requestBody["questionId"],
          },
          {
            $set: {
              "tenseEra.$[].stage.$[isCorrect].numberOfCorrect":
                stages["numberOfCorrect"],
              "tenseEra.$[].stage.$[isCorrect].numberOfInCorrect":
                stages["numberOfInCorrect"],
              "tenseEra.$[].stage.$[isCorrect].attemptQuestions":
                stages["attemptQuestions"],
              "tenseEra.$[].stage.$[isCorrect].lives": stages["lives"],
            },
          },
          {
            arrayFilters: [
              {
                "isCorrect.stageId": requestBody["stageId"],
              },
            ],
          }
        );
      }

      //checking incorrect answer is three then retry game logic
      // if (stages["numberOfInCorrect"] >= 3 || stages["lives"] <= 0) {
      if (
        (!stages["isLivePurchased"] && stages["numberOfInCorrect"] >= 3) ||
        stages["lives"] <= 0
      ) {
        answerResponseFormat.completedEra = false;
        answerResponseFormat.completedStage = false;
        answerResponseFormat.nextQuestion = false;
        answerResponseFormat.isGameOver = true;

        return reponseModel(
          httpStatusCodes.OK,
          "Game is over. Unfortunately, you have given three incorrect answers! You can buy lives or replay the game.",
          false,
          { answerResponseFormat },
          req,
          res
        );
      }

      //checking user completed ten(10) questions of a stage
      let answerCount = null;
      if (stages["attemptQuestions"] === stageQuestionSize.size) {
        answerCount = await getGermsDetails(userAnswerEraModel, requestBody);
        if (isEmpty(answerCount)) {
          answerResponseFormat.completedEra = false;
          answerResponseFormat.completedStage = true;
          answerResponseFormat.nextQuestion = false;
          answerResponseFormat.isGameOver = false;
          answerResponseFormat.isError = true;

          return reponseModel(
            httpStatusCodes.OK,
            "Something happening wrong",
            false,
            { answerResponseFormat },
            req,
            res
          );
        }
        /* germs calculation start */
        answerCount = answerCount[0];
        //getting era earngerms
        const stageCompletionGerms = earningCoinsRule.coins.defaultCoins;
        let eraLevelEarnGerms = answerCount["tenseEra"][0]["earnGerms"];
        eraLevelEarnGerms = parseInt(eraLevelEarnGerms);

        let userSessionWiseTotalGerms = parseInt(answerCount["earnGerms"]); //getting current user session germs

        answerCount = stageFilter({ answerCount, requestBody });
        let earnStars = earnCoins(answerCount, stages["lives"]);

        //if user has purchased the lives then give one star
        if (stages["isLivePurchased"] === true) {
          earnStars["germs"] = 0;
          earnStars["stars"] = earningCoinsRule.stars.oneStars.star;
        }

        //adding era earn germs with curret stage
        earnStars["eraGerms"] =
          parseInt(earnStars["germs"]) +
          eraLevelEarnGerms +
          stageCompletionGerms;

        //adding user germs with curret session
        earnStars["userSessionGerms"] =
          parseInt(earnStars["germs"]) +
          userSessionWiseTotalGerms +
          stageCompletionGerms;

        const updateCoins = await updateCoin(
          userAnswerEraModel,
          requestBody,
          earnStars
        );

        //calculating user germs
        if (
          updateCoins?.modifiedCount > 0 &&
          updateCoins?.acknowledged === true
        ) {
          const userDetails = await getUserDetails(
            userModel,
            requestBody["userId"]
          );
          if (!isEmpty(userDetails)) {
            let userTotalGerms = 0;
            let userEarnGerms = 0;
            userEarnGerms = userDetails?.earnGerms;
            userTotalGerms = userDetails?.totalEarnGerms;

            userEarnGerms =
              parseInt(userEarnGerms) +
              parseInt(earnStars["germs"]) +
              stageCompletionGerms;

            userTotalGerms =
              parseInt(userTotalGerms) +
              parseInt(earnStars["germs"]) +
              stageCompletionGerms;

            let payload = {
              earnGerms: userEarnGerms,
              totalEarnGerms: userTotalGerms,
            };
            const updateUser = await updateUserDetails(
              userModel,
              requestBody["userId"],
              payload
            );
          }
        }
        /* germs calculation end */

        answerResponseFormat.completedEra = false;
        answerResponseFormat.completedStage = true;
        answerResponseFormat.nextQuestion = false;
        answerResponseFormat.isGameOver = false;

        /* preparig and creating user answer history */
        userAnswerEraHisotryPayloadReset();
        const tenseStageDetail = await getLivesOfUnlockStage(
          userAnswerEraModel,
          requestBody
        );
        const hisotryPayload = await userAnswerEraHisotryPayloadPrepare(
          tenseStageDetail,
          requestBody
        );
        //creating history
        const createdUserEraAnswerHistory = await createUserEraAnswerHistory(
          userAnswerEraHistoryModel,
          userAnswerEraHisotryPayload
        );
        /* preparig and creating user answer history end */

        return reponseModel(
          httpStatusCodes.OK,
          "Stage has been completed",
          true,
          {
            answerResponseFormat,
            hisotryPayload,
          },
          req,
          res
        );
      }

      if (
        savedUserAnswer?.modifiedCount > 0 &&
        savedUserAnswer?.acknowledged === true
      ) {
        answerResponseFormat.nextQuestion = true;
        answerResponseFormat.completedStage = false;
        answerResponseFormat.isGameOver = false;
        return reponseModel(
          httpStatusCodes.OK,
          "Answer saved successful",
          true,
          { answerResponseFormat },
          req,
          res
        );
      } else {
        answerResponseFormat.nextQuestion = null;
        return reponseModel(
          httpStatusCodes.OK,
          "Wrong question attempt",
          true,
          {
            ...answerResponseFormat,
            heartLive: 0,
            isCorrect: null,
            isError: true,
          },
          req,
          res
        );
      }
    }
  } catch (error) {
    next(error);
  }
};

exports.getEraWiseUserAnswerDetail = async (req, res, next) => {
  try {
    const requestBody = req.body;
    const tenseEraDetail = await userAnswerEraModel.findOne({
      userId: requestBody["userId"],
      sessionId: requestBody["sessionId"],
      // "tenseEra.tenseEraId": requestBody["tenseEraId"],
      tenseEra: { $elemMatch: { tenseEraId: requestBody["tenseEraId"] } },
    });

    return reponseModel(
      httpStatusCodes.OK,
      isEmpty(tenseEraDetail) ? "Record not found" : "Record found",
      isEmpty(tenseEraDetail) ? false : true,
      tenseEraDetail,
      req,
      res
    );
  } catch (error) {
    next(error);
  }
};

exports.userRetryStage = async (req, res, next) => {
  try {
    const requestBody = req.body;
    // reseting answerResponseFormat
    answerResponseFormat.completedEra = false;
    answerResponseFormat.completedStage = false;
    answerResponseFormat.nextQuestion = false;
    answerResponseFormat.isGameOver = false;
    answerResponseFormat.isCorrect = null;

    //reseting  userAnswerEraHisotryPayload
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

    const tenseStageDetail = await userAnswerEraModel.findOne({
      userId: requestBody["userId"],
      sessionId: requestBody["sessionId"],
      "tenseEra.tenseEraId": requestBody["tenseEraId"],
      "tenseEra.stage.stageId": requestBody["stageId"],
    });

    // preparing history
    userAnswerEraHisotryPayload.userAnswerEraId = tenseStageDetail["_id"];
    userAnswerEraHisotryPayload.userId = requestBody["userId"];
    userAnswerEraHisotryPayload.sessionId = requestBody["sessionId"];
    userAnswerEraHisotryPayload.tenseEraId = requestBody["tenseEraId"];
    userAnswerEraHisotryPayload.stageId = requestBody["stageId"];

    const stage = stageFilter({
      answerCount: tenseStageDetail,
      requestBody,
    });

    if (!isEmpty(stage)) {
      delete stage["histories"];
      delete stage["_id"];
      if (stage["lives"] <= 0) {
        // delete stage["histories"];
        // delete stage["_id"];

        // preparing history
        userAnswerEraHisotryPayload.earnStars = stage["earnStars"];
        userAnswerEraHisotryPayload.earnGerms = stage["earnGerms"];
        userAnswerEraHisotryPayload.questions = stage["question"];
        userAnswerEraHisotryPayload.startTime = stage["startTime"];
        userAnswerEraHisotryPayload.endTime = stage["endTime"];
        userAnswerEraHisotryPayload.stage = stage;
        userAnswerEraHisotryPayload.stage["tenseEraId"] =
          requestBody["tenseEraId"];
        delete userAnswerEraHisotryPayload["stage"]["question"];

        const retryDetail = await retryGame(
          userAnswerEraModel,
          stage,
          requestBody
        );

        //creating history
        const createdUserEraAnswerHistory = await createUserEraAnswerHistory(
          userAnswerEraHistoryModel,
          userAnswerEraHisotryPayload
        );

        let questions = await getRandomQuestions(req, res, next);
        questions = questions["data"];

        return reponseModel(
          httpStatusCodes.OK,
          !isEmpty(questions) ? "Questions found" : "Questions not found",
          !isEmpty(questions) ? true : false,
          {
            questions,
            ...answerResponseFormat,
            heartLive: 3,
            isLivePurchased: false,
          },
          req,
          res
        );
      } else if (stage["completedStage"] === true) {
        // delete stage["histories"];
        // delete stage["_id"];

        // preparing history
        userAnswerEraHisotryPayload.earnStars = stage["earnStars"];
        userAnswerEraHisotryPayload.earnGerms = stage["earnGerms"];
        userAnswerEraHisotryPayload.questions = stage["question"];
        userAnswerEraHisotryPayload.startTime = stage["startTime"];
        userAnswerEraHisotryPayload.endTime = stage["endTime"];
        userAnswerEraHisotryPayload.stage = stage;
        userAnswerEraHisotryPayload.stage["tenseEraId"] =
          requestBody["tenseEraId"];
        delete userAnswerEraHisotryPayload["stage"]["question"];

        const retryDetail = await retryGame(
          userAnswerEraModel,
          stage,
          requestBody
        );

        //creating history
        const createdUserEraAnswerHistory = await createUserEraAnswerHistory(
          userAnswerEraHistoryModel,
          userAnswerEraHisotryPayload
        );

        let questions = await getRandomQuestions(req, res, next);
        questions = questions["data"];

        return reponseModel(
          httpStatusCodes.OK,
          !isEmpty(questions) ? "Questions found" : "Questions not found",
          !isEmpty(questions) ? true : false,
          {
            questions,
            ...answerResponseFormat,
            heartLive: 3,
            isLivePurchased: false,
          },
          req,
          res
        );
      } else {
        return reponseModel(
          httpStatusCodes.OK,
          `Please do not retry! You have still ${stage["lives"]} lives. Continue with the game`,
          false,
          "",
          req,
          res
        );
      }
    } else {
      return reponseModel(
        httpStatusCodes.OK,
        `Something went wrong! Please try again.`,
        false,
        "",
        req,
        res
      );
    }
  } catch (error) {
    next(error);
  }
};

async function getRandomQuestions(req, res, next) {
  try {
    const requestBody = req.body;
    let userChooseEra = await userAnswerEraModel.findOne({
      userId: requestBody["userId"],
      sessionId: requestBody["sessionId"],
      "tenseEra.tenseEraId": requestBody["tenseEraId"],
    });

    let notAttendedStage;
    userChooseEra?.tenseEra[0]?.stage.some(async (stage, index) => {
      if (stage.sequence === 1 && stage.question.length < 10) {
        notAttendedStage = stage;
      } else if (stage.sequence === 2 && stage.question.length < 10) {
        notAttendedStage = stage;
      } else if (stage.sequence === 3 && stage.question.length < 10) {
        notAttendedStage = stage;
      } else {
        notAttendedStage = stage;
      }
    });

    let questions;
    if (notAttendedStage?.sequence === 4) {
      //boss level questions
      req.params["tenseEraId"] = requestBody["tenseEraId"];
      questions = await getRandomQuestionByEra(req, res, next);
    } else {
      //stage level questions
      req.params["stageId"] = notAttendedStage["stageId"];
      questions = await getRandomQuestionByStage(req, res, next);
    }
    requestBody["stageId"] = notAttendedStage["stageId"];
    await unlockStage(userAnswerEraModel, requestBody, false);

    return questions;
  } catch (error) {
    next(error);
  }
}

exports.getUserCurrentEra = async (req, res, next) => {
  try {
    const requestBody = req.body;
    req.params["id"] = requestBody["tenseEraId"];

    const userAndSessionInUserAnswer = await this.userAndSessionInUserAnswer(
      req,
      res,
      next
    );
    //check if user and session are already
    if (!isEmpty(userAndSessionInUserAnswer["data"])) {
      let userEras = await userAnswerEraModel.findOne({
        userId: requestBody["userId"],
        sessionId: requestBody["sessionId"],
        "tenseEra.tenseEraId": requestBody["tenseEraId"],
      });

      //check if stage and era are already
      if (!isEmpty(userEras)) {
        const currentEra = eraFilter({
          tenseEra: userEras["tenseEra"],
          requestBody: requestBody,
        });

        //track the locked stage and update it to unlocked stage
        let filterStages = await filterStage(userAnswerEraModel, requestBody);

        filterStages = filterStages[0]["tenseEra"][0]["stage"];
        let unLockedStage = [];
        let lockedStage = [];
        filterStages.map((item, index) => {
          if (item?.question.length > 0 && item?.earnStars > 0) {
            delete item?.question;
            unLockedStage.push(item);
          } else {
            lockedStage.push(item);
          }
        });

        if (lockedStage.length > 0) {
          requestBody["stageId"] = lockedStage[0]["stageId"];
          await unlockStage(userAnswerEraModel, requestBody, false);

          currentEra["stage"].forEach((element) => {
            if (element?.stageId === requestBody["stageId"].toString()) {
              element.isLocked = false;
            }
          });
        }

        return reponseModel(
          httpStatusCodes.OK,
          "User era found",
          true,
          currentEra,
          req,
          res
        );
      } else {
        //check if stage and era are not already
        let eraStages = await findEra(req, res, next);
        const tenseEraTitle = eraStages["data"]?.title;
        eraStages = eraStages["data"]["stage"];
        const eraStagesPayload = eraStages.map((stage, indx) => {
          return {
            stageId: stage._id,
            sequence: stage.sequence,
            stageTitle: stage.title,
          };
        });

        const tenseEraPayload = {
          tenseEraId: requestBody["tenseEraId"],
          tenseEraTitle,
          attempt: 1,
          stage: eraStagesPayload,
        };
        let createUserErasPayload = await new userAnswerEraModel({
          tenseEra: tenseEraPayload,
        });
        createUserErasPayload = createUserErasPayload["tenseEra"];

        const savedUserEra = await userAnswerEraModel.updateOne(
          {
            userId: requestBody["userId"],
            sessionId: requestBody["sessionId"],
          },
          {
            $push: {
              tenseEra: createUserErasPayload,
            },
          }
        );

        let userEras = await userAnswerEraModel.findOne({
          userId: requestBody["userId"],
          sessionId: requestBody["sessionId"],
          "tenseEra.tenseEraId": requestBody["tenseEraId"],
        });

        const currentEra = eraFilter({
          tenseEra: userEras["tenseEra"],
          requestBody: requestBody,
        });

        requestBody["stageId"] = currentEra["stage"][0]["stageId"];
        await unlockStage(userAnswerEraModel, requestBody, false);

        return reponseModel(
          httpStatusCodes.OK,
          "User era found",
          true,
          currentEra,
          req,
          res
        );
      }
    } else {
      let eraStages = await findEra(req, res, next);
      const tenseEraTitle = eraStages["data"]?.title;
      eraStages = eraStages["data"]["stage"];
      const eraStagesPayload = eraStages.map((stage, indx) => {
        return {
          stageId: stage._id,
          sequence: stage.sequence,
          stageTitle: stage.title,
        };
      });

      const tenseEraPayload = {
        tenseEraId: requestBody["tenseEraId"],
        tenseEraTitle,
        attempt: 1,
        stage: eraStagesPayload,
      };
      const createUserEras = await new userAnswerEraModel({
        userId: requestBody["userId"],
        tenseEra: tenseEraPayload,
        sessionId: requestBody["sessionId"],
      });
      const createdUserEras = await createUserEras.save();

      requestBody["stageId"] =
        createdUserEras["tenseEra"][0]["stage"][0]["stageId"];

      createdUserEras["tenseEra"][0]["stage"][0]["isLocked"] = false;

      const currentEra = eraFilter({
        tenseEra: createdUserEras["tenseEra"],
        requestBody: requestBody,
      });

      await unlockStage(userAnswerEraModel, requestBody, false);

      return reponseModel(
        httpStatusCodes.OK,
        "User era found",
        true,
        currentEra,
        req,
        res
      );
    }
  } catch (err) {
    next(err);
  }
};

exports.userAndSessionInUserAnswer = async (req, res, next) => {
  try {
    const requestBody = req.body;
    const userData = await userAnswerEraModel.findOne(
      {
        userId: requestBody["userId"],
        sessionId: requestBody["sessionId"],
      },
      {
        _id: 1,
        userId: 1,
        sessionId: 1,
        tenseEra: 1,
      }
    );

    return reponseModel(
      httpStatusCodes.OK,
      isEmpty(userData) ? "User not found" : "User already exists",
      isEmpty(userData) ? false : true,
      userData,
      req,
      res
    );
  } catch (error) {
    next(error);
  }
};

const updateCoins = async (requestBody, coinObj) => {
  const updateCoin = await userAnswerEraModel.updateOne(
    {
      userId: requestBody["userId"],
      sessionId: requestBody["sessionId"],
      "tenseEra.tenseEraId": requestBody["tenseEraId"],
      "tenseEra.stage.stageId": requestBody["stageId"],
    },
    {
      $set: {
        "tenseEra.$[].stage.$[coins].earnStars": coinObj["stars"],
        "tenseEra.$[].stage.$[coins].earnGerms": coinObj["germs"],
        "tenseEra.$[].stage.$[coins].completedStage": true,
        "tenseEra.$[].stage.$[coins].defaultGerms":
          earningCoinsRule.coins.defaultCoins,
      },
    },
    {
      arrayFilters: [
        {
          "coins.stageId": requestBody["stageId"],
        },
      ],
    }
  );

  if (coinObj["germs"] > 0) {
    await userAnswerEraModel.updateOne(
      {
        userId: requestBody["userId"],
        sessionId: requestBody["sessionId"],
        "tenseEra.tenseEraId": requestBody["tenseEraId"],
      },
      {
        $set: {
          "tenseEra.$[coins].earnGerms": coinObj["germs"],
          earnGerms: coinObj["germs"],
        },
      },
      {
        arrayFilters: [
          {
            "coins.tenseEraId": requestBody["tenseEraId"],
          },
        ],
      }
    );
  }
  return updateCoin;
};

//temporary api this will be removed in a future release
exports.eraseUserStageAttempts = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deleted = await userAnswerEraModel.deleteMany({});

    return reponseModel(
      httpStatusCodes.OK,
      "Deleted success",
      true,
      deleted,
      req,
      res
    );
  } catch (err) {
    next(err);
  }
};

//temporary api this will be removed in a future release
exports.getCurrentUserAndSessionId = async (req, res, next) => {
  var mysort = { createdAt: -1 };
  try {
    const userData = await userAnswerEraModel
      .findOne({}, { userId: 1, sessionId: 1 })
      .sort(mysort);

    return reponseModel(
      httpStatusCodes.OK,
      !isEmpty(userData) ? "Record found" : "Record not found",
      isEmpty(userData) ? false : true,
      userData,
      req,
      res
    );
  } catch (err) {
    next(err);
  }
};
