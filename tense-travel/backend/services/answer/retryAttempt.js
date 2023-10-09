const {
  heartLives,
  earningCoinsRule,
} = require("../../utils/constants/payloadInterface/payload.interface");
const ObjectID = require("mongodb").ObjectId;
const { mongoose } = require("../../configs/dbConnection");

const retryGame = async (model, historyPayload, requestBody) => {
  let retryCount = parseInt(historyPayload["retryCount"]);
  retryCount++;

  const savedUserAnswer = await model.updateOne(
    {
      userId: requestBody["userId"],
      sessionId: requestBody["sessionId"],
      "tenseEra.tenseEraId": requestBody["tenseEraId"],
      "tenseEra.stage.stageId": requestBody["stageId"],
    },
    {
      $push: {
        "tenseEra.$[].stage.$[history].histories": historyPayload,
      },
    },
    {
      arrayFilters: [
        {
          "history.stageId": new ObjectID(requestBody["stageId"]),
        },
      ],
    }
  );

  await model.updateOne(
    {
      userId: requestBody["userId"],
      sessionId: requestBody["sessionId"],
      "tenseEra.tenseEraId": requestBody["tenseEraId"],
      "tenseEra.stage.stageId": requestBody["stageId"],
    },
    {
      $set: {
        "tenseEra.$[].stage.$[isCorrect].retryCount": retryCount,
        "tenseEra.$[].stage.$[isCorrect].earnStars": 0,
        "tenseEra.$[].stage.$[isCorrect].earnGerms": 0,
        "tenseEra.$[].stage.$[isCorrect].completedStage": false,
        "tenseEra.$[].stage.$[isCorrect].numberOfCorrect": 0,
        "tenseEra.$[].stage.$[isCorrect].numberOfInCorrect": 0,
        "tenseEra.$[].stage.$[isCorrect].attemptQuestions": 0,
        "tenseEra.$[].stage.$[isCorrect].lives": heartLives.live,
        "tenseEra.$[].stage.$[isCorrect].question": [],
        "tenseEra.$[].stage.$[isCorrect].isLivePurchased": false,
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

  return savedUserAnswer;
};

const unlockStage = async (model, requestBody, locked) => {
  const unlockStage = await model.updateOne(
    {
      userId: requestBody["userId"],
      sessionId: requestBody["sessionId"],
      "tenseEra.tenseEraId": requestBody["tenseEraId"],
      "tenseEra.stage.stageId": requestBody["stageId"],
    },
    {
      $set: {
        "tenseEra.$[].stage.$[coins].isLocked": locked,
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
  return unlockStage;
};

/**purchase lives */
const buyLives = async (
  models,
  historyPayload,
  userPayload,
  userAnswerEraHisotryPayload,
  requestBody,
  next
) => {
  const session = await mongoose.startSession();
  try {
    let livePurchasedCount = parseInt(historyPayload["livePurchasedCount"]);
    livePurchasedCount++;
    const eraCoins = userPayload?.eraCoins;
    delete userPayload["eraCoins"];

    session.startTransaction();

    const savedUserAnswer = await models["userAnswerModel"].updateOne(
      {
        userId: requestBody["userId"],
        sessionId: requestBody["sessionId"],
        "tenseEra.tenseEraId": requestBody["tenseEraId"],
        "tenseEra.stage.stageId": requestBody["stageId"],
      },
      {
        $push: {
          "tenseEra.$[].stage.$[history].histories": historyPayload,
        },
      },
      {
        arrayFilters: [
          {
            "history.stageId": new ObjectID(requestBody["stageId"]),
          },
        ],
      }
    );

    await models["userAnswerModel"].updateOne(
      {
        userId: requestBody["userId"],
        sessionId: requestBody["sessionId"],
        "tenseEra.tenseEraId": requestBody["tenseEraId"],
        "tenseEra.stage.stageId": requestBody["stageId"],
      },
      {
        $set: {
          "tenseEra.$[].stage.$[isCorrect].isLivePurchased": true,
          "tenseEra.$[].stage.$[isCorrect].livePurchasedCount":
            livePurchasedCount,
          "tenseEra.$[].stage.$[isCorrect].livePurchasedSpendingCoin":
            earningCoinsRule?.buyLives?.coin,
          "tenseEra.$[].stage.$[isCorrect].earnStars": 0,
          "tenseEra.$[].stage.$[isCorrect].earnGerms": 0,
          "tenseEra.$[].stage.$[isCorrect].completedStage": false,
          // "tenseEra.$[].stage.$[isCorrect].numberOfCorrect": 0,
          // "tenseEra.$[].stage.$[isCorrect].numberOfInCorrect": 0,
          // "tenseEra.$[].stage.$[isCorrect].attemptQuestions": 0,
          "tenseEra.$[].stage.$[isCorrect].lives":
            earningCoinsRule?.buyLives?.lives,
          // "tenseEra.$[].stage.$[isCorrect].question": [],
          "tenseEra.$[].earnGerms": eraCoins,
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

    const updateUserDetails = await models["userModel"].findOneAndUpdate(
      {
        _id: new ObjectID(requestBody["userId"]),
      },
      userPayload,
      { upsert: true }
    );

    const createUserHistory = await new models["userAnswerHistoryModel"]({
      userAnswerEraId: userAnswerEraHisotryPayload["userAnswerEraId"],
      userId: userAnswerEraHisotryPayload["userId"],
      sessionId: userAnswerEraHisotryPayload["sessionId"],
      tenseEraId: userAnswerEraHisotryPayload["tenseEraId"],
      stageId: userAnswerEraHisotryPayload["stageId"],
      earnStars: userAnswerEraHisotryPayload["earnStars"],
      earnGerms: userAnswerEraHisotryPayload["earnGerms"],
      stage: userAnswerEraHisotryPayload["stage"],
      questions: userAnswerEraHisotryPayload["questions"],
      startTime: userAnswerEraHisotryPayload["startTime"],
      endTime: userAnswerEraHisotryPayload["endTime"],
    });

    createUserHistory.save();

    await session.commitTransaction();
    await session.endSession();

    return savedUserAnswer;
  } catch (error) {
    await session.abortTransaction();
    next(error);
  }
};

const createUserEraAnswerHistory = async (
  model,
  userAnswerEraHisotryPayload
) => {
  const createUserHistory = await new model({
    userAnswerEraId: userAnswerEraHisotryPayload["userAnswerEraId"],
    userId: userAnswerEraHisotryPayload["userId"],
    sessionId: userAnswerEraHisotryPayload["sessionId"],
    tenseEraId: userAnswerEraHisotryPayload["tenseEraId"],
    stageId: userAnswerEraHisotryPayload["stageId"],
    earnStars: userAnswerEraHisotryPayload["earnStars"],
    earnGerms: userAnswerEraHisotryPayload["earnGerms"],
    stage: userAnswerEraHisotryPayload["stage"],
    questions: userAnswerEraHisotryPayload["questions"],
    startTime: userAnswerEraHisotryPayload["startTime"],
    endTime: userAnswerEraHisotryPayload["endTime"],
  });

  const createdUserHistory = await createUserHistory.save();

  return createdUserHistory;
};

module.exports = {
  retryGame,
  unlockStage,
  buyLives,
  createUserEraAnswerHistory,
};
