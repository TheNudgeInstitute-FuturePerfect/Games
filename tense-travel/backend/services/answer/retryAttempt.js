const {
  heartLives,
  earningCoinsRule,
} = require("../../utils/constants/payloadInterface/payload.interface");
const ObjectID = require("mongodb").ObjectId;

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

const buyLives = async (
  models,
  historyPayload,
  userPayload,
  requestBody,
  next
) => {
  try {
    let livePurchasedCount = parseInt(historyPayload["livePurchasedCount"]);
    livePurchasedCount++;
    const eraCoins = userPayload?.eraCoins;
    delete userPayload["eraCoins"];

    // const session = MongoClient.startSession();
    // const client = connectToDb.MongoClient();
    // client.startTransaction();

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
          "tenseEra.$[].stage.$[isCorrect].numberOfCorrect": 0,
          "tenseEra.$[].stage.$[isCorrect].numberOfInCorrect": 0,
          "tenseEra.$[].stage.$[isCorrect].attemptQuestions": 0,
          "tenseEra.$[].stage.$[isCorrect].lives":
            earningCoinsRule?.buyLives?.lives,
          "tenseEra.$[].stage.$[isCorrect].question": [],
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
        _id: new ObjectID(requestBody['userId']),
      },
      userPayload,
      { upsert: true }
    );

    return savedUserAnswer;
  } catch (error) {
    // await client.abortTransaction();
    next(error);
  }
};

module.exports = { retryGame, unlockStage, buyLives };
