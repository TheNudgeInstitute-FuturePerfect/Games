const { userAnswerEraModel } = require("../models/index");
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
  stageAndQuestionFilter,
  earnCoins,
  answerResponseFormat,
  eraFilter,
} = require("../utils/constants/payloadInterface/payload.interface");
const { retryGame, unlockStage } = require("./answer/retryAttempt");
const ObjectID = require("mongodb").ObjectId;

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

    req.params["id"] = req.body["questionId"];
    let questionDetail = await getQuestionDetails(req, res, next);
    questionDetail = questionDetail["data"];

    let answerExists = await userAnswerEraModel.findOne({
      userId: requestBody["userId"],
      sessionId: requestBody["sessionId"],
      "tenseEra.tenseEraId": requestBody["tenseEraId"],
      "tenseEra.stage.stageId": requestBody["stageId"],
      // "tenseEra.stage.question.questionBankId": requestBody["questionId"],
    });

    answerExists = stageAndQuestionFilter({ answerExists, requestBody });
    let { stages, userAnswerDetail } = answerExists;
    answerResponseFormat.heartLive = stages["lives"];

    if (stages["lives"] === 0) {
      answerResponseFormat.completedEra = false;
      answerResponseFormat.completedStage = false;
      answerResponseFormat.nextQuestion = false;

      return reponseModel(
        httpStatusCodes.OK,
        "Game is over. Unfortunately, you have given three incorrect answers! You can buy lives or replay the game.",
        false,
        { answerResponseFormat },
        req,
        res
      );
    } else if (stages?.question.length === 10) {
      answerResponseFormat.completedEra = false;
      answerResponseFormat.completedStage = true;
      return reponseModel(
        httpStatusCodes.OK,
        "Stage has already been completed",
        false,
        { answerResponseFormat },
        req,
        res
      );
    } else if (!isEmpty(userAnswerDetail)) {
      answerResponseFormat.nextQuestion = true;
      answerResponseFormat.isCorrect = null;
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
      answerPayload.question = questionDetail.question;
      answerPayload.answer = questionDetail.answer;
      answerPayload.userAnswer = requestBody.userAnswer;
      answerPayload.questionBankId = requestBody.questionId;
      stages["attemptQuestions"]++;

      //checking the answer is correct or incorrect
      if (
        requestBody["userAnswer"].toLocaleLowerCase().trim() ===
        questionDetail["answer"].toLocaleLowerCase().trim()
      ) {
        answerPayload.isCorrect = true;
        stages["numberOfCorrect"]++;
        answerResponseFormat.isCorrect = true;
      } else {
        answerPayload.isCorrect = false;
        stages["numberOfInCorrect"]++;
        stages["lives"]--;
        answerResponseFormat.heartLive--;
        answerResponseFormat.isCorrect = false;
      }

      //save user answer of the question
      const savedUserAnswer = await userAnswerEraModel.updateOne(
        {
          userId: requestBody["userId"],
          sessionId: requestBody["sessionId"],
          "tenseEra.tenseEraId": requestBody["tenseEraId"],
          "tenseEra.stage.stageId": requestBody["stageId"],
        },
        {
          $push: {
            "tenseEra.$[].stage.$.question": answerPayload,
          },
        }
      );
      if (
        savedUserAnswer?.modifiedCount > 0 &&
        savedUserAnswer?.acknowledged === true
      ) {
        //stage update(nextQuestion, numberOfInCorrect, attemptQuestions)
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
      if (stages["numberOfInCorrect"] >= 3) {
        answerResponseFormat.completedEra = false;
        answerResponseFormat.completedStage = false;
        answerResponseFormat.nextQuestion = false;

        return reponseModel(
          httpStatusCodes.OK,
          "Game is over. Unfortunately, you have given three incorrect answers! You can buy lives or replay the game.",
          false,
          { answerResponseFormat },
          req,
          res
        );
      }

      //checking user completed ten questions of a stage
      let answerCount = null;
      if (stages["attemptQuestions"] === 10) {
        answerCount = await userAnswerEraModel.findOne(
          {
            userId: requestBody["userId"],
            sessionId: requestBody["sessionId"],
            "tenseEra.tenseEraId": requestBody["tenseEraId"],
            "tenseEra.stage.stageId": requestBody["stageId"],
            "tenseEra.stage.question.questionBankId": requestBody["questionId"],
            "tenseEra.stage.question": { $size: 10 },
          },
          { tenseEra: 1 }
        );

        answerCount = stageFilter({ answerCount, requestBody });
        let earnCoin = earnCoins(answerCount);

        const updateCoin = await updateCoins(requestBody, earnCoin);

        answerResponseFormat.completedEra = false;
        answerResponseFormat.completedStage = true;
        answerResponseFormat.nextQuestion = false;

        return reponseModel(
          httpStatusCodes.OK,
          "Stage has already been completed",
          true,
          { answerResponseFormat },
          req,
          res
        );
      }
      answerResponseFormat.nextQuestion = true;
      return reponseModel(
        httpStatusCodes.OK,
        "Answer saved successful",
        true,
        { answerResponseFormat },
        req,
        res
      );
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

    const tenseStageDetail = await userAnswerEraModel.findOne({
      userId: requestBody["userId"],
      sessionId: requestBody["sessionId"],
      "tenseEra.tenseEraId": requestBody["tenseEraId"],
      "tenseEra.stage.stageId": requestBody["stageId"],
    });

    const stage = stageFilter({
      answerCount: tenseStageDetail,
      requestBody,
    });

    if (stage["lives"] === 0) {
      delete stage["histories"];
      delete stage["_id"];

      const retryDetail = await retryGame(
        userAnswerEraModel,
        stage,
        requestBody
      );

      const questions = await getRandomQuestions(req, res, next);
      return reponseModel(
        httpStatusCodes.OK,
        questions ? "Questions found" : "Questions not found",
        questions ? true : false,
        questions["data"],
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
