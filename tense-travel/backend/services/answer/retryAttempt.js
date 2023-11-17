const {
  heartLives,
  earningCoinsRule,
} = require("../../utils/constants/payloadInterface/payload.interface");
const ObjectID = require("mongodb").ObjectId;
const { mongoose } = require("../../configs/dbConnection");
const {
  generateSessionId,
  checkStageIsAnswered,
} = require("../global-services/filterEraSatage.service");

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

const unlockStageWithoutSessionId = async (model, requestBody, locked) => {
  const unlockStage = await model.updateOne(
    {
      userId: requestBody["userId"],
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

const resetStageInUserAnswer = async (model, requestBody) => {
  // let retryCount = parseInt(historyPayload["retryCount"]);
  // retryCount++;

  // let attemptCount = parseInt(historyPayload["attemptCount"]);
  // attemptCount++;

  const resetData = await model.updateOne(
    {
      userId: requestBody["userId"],
      "tenseEra.tenseEraId": requestBody["tenseEraId"],
      "tenseEra.stage.stageId": requestBody["stageId"],
    },
    {
      $set: {
        // "tenseEra.$[].stage.$[isCorrect].attempt": attemptCount,
        "tenseEra.$[].stage.$[isCorrect].earnStars": 0,
        "tenseEra.$[].stage.$[isCorrect].defaultGerms": 0,
        "tenseEra.$[].stage.$[isCorrect].earnGerms": 0,
        "tenseEra.$[].stage.$[isCorrect].completedStage": false,
        "tenseEra.$[].stage.$[isCorrect].numberOfCorrect": 0,
        "tenseEra.$[].stage.$[isCorrect].numberOfInCorrect": 0,
        "tenseEra.$[].stage.$[isCorrect].attemptQuestions": 0,
        "tenseEra.$[].stage.$[isCorrect].lives": heartLives.live,
        "tenseEra.$[].stage.$[isCorrect].question": [],
        "tenseEra.$[].stage.$[isCorrect].histories": [],
        "tenseEra.$[].stage.$[isCorrect].isLivePurchased": false,
        "tenseEra.$[].stage.$[isCorrect].sessionId": null,
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

  return resetData;
};

const resetStage = async (model, requestBody) => {
  const resetData = await model.updateOne(
    {
      userId: requestBody["userId"],
      "tenseEra.tenseEraId": requestBody["tenseEraId"],
      "tenseEra.stage.stageId": requestBody["stageId"],
    },
    {
      $set: {
        sessionId: null,
        "tenseEra.$[].stage.$[isCorrect].earnStars": 0,
        "tenseEra.$[].stage.$[isCorrect].defaultGerms": 0,
        "tenseEra.$[].stage.$[isCorrect].earnGerms": 0,
        "tenseEra.$[].stage.$[isCorrect].completedStage": false,
        "tenseEra.$[].stage.$[isCorrect].numberOfCorrect": 0,
        "tenseEra.$[].stage.$[isCorrect].numberOfInCorrect": 0,
        "tenseEra.$[].stage.$[isCorrect].attemptQuestions": 0,
        "tenseEra.$[].stage.$[isCorrect].lives": heartLives.live,
        "tenseEra.$[].stage.$[isCorrect].question": [],
        "tenseEra.$[].stage.$[isCorrect].histories": [],
        "tenseEra.$[].stage.$[isCorrect].isLivePurchased": false,
        "tenseEra.$[].stage.$[isCorrect].sessionId": null,
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

  return resetData;
};

const getStageSessionId = async (model, requestBody) => {
  // const sessionId = await model.findOne(
  //   {
  //     userId: requestBody["userId"],
  //     "tenseEra.tenseEraId": requestBody["tenseEraId"],
  //     "tenseEra.stage.stageId": requestBody["stageId"],
  //   },
  //   {
  //     sessionId: 1,
  //     startTime: 1,
  //     tenseEra: 1,
  //   }
  // );
  const sessionId = await checkStageIsAnswered(model, requestBody);

  return sessionId;
};

const addNewStageSessionIdInUserAnswer = async (model, requestBody) => {
  const sessionId = await generateSessionId();
  const newSessionId = await model.updateOne(
    {
      userId: new ObjectID(requestBody["userId"]),
      "tenseEra.tenseEraId": new ObjectID(requestBody["tenseEraId"]),
      "tenseEra.stage.stageId": new ObjectID(requestBody["stageId"]),
    },
    {
      $set: {
        sessionId: sessionId,
        startTime: requestBody["startTime"],
        "tenseEra.$[].stage.$[stageData].sessionId": sessionId,
        "tenseEra.$[].stage.$[stageData].startTime": requestBody["startTime"],
        "tenseEra.$[].stage.$[stageData].attempt": requestBody["attempt"],
      },
    },
    {
      arrayFilters: [
        {
          "stageData.stageId": new ObjectID(requestBody["stageId"]),
        },
      ],
    }
  );

  return newSessionId;
};

const updateSessionEndTimeInUserAnswer = async (model, requestBody) => {
  const updatedData = await model.updateOne(
    {
      userId: new ObjectID(requestBody["userId"]),
      "tenseEra.tenseEraId": new ObjectID(requestBody["tenseEraId"]),
      "tenseEra.stage.stageId": new ObjectID(requestBody["stageId"]),
    },
    {
      $set: {
        endTime: requestBody["endTime"],
        "tenseEra.$[].stage.$[stageData].endTime": requestBody["endTime"],
      },
    },
    {
      arrayFilters: [
        {
          "stageData.stageId": new ObjectID(requestBody["stageId"]),
        },
      ],
    }
  );

  return updatedData;
};

const updateSessionIdStartTimeInUserAnswer = async (model, requestBody) => {
  const updatedData = await model.updateOne(
    {
      userId: new ObjectID(requestBody["userId"]),
      "tenseEra.tenseEraId": new ObjectID(requestBody["tenseEraId"]),
      "tenseEra.stage.stageId": new ObjectID(requestBody["stageId"]),
    },
    requestBody["query"]
  );

  return updatedData;
};

const updateExplanationStatusInUserAnsweredQuestion = async (model, requestBody) => {
  const updateAnswerExplanation = await model.updateOne(
    {
      userId: new ObjectID(requestBody["userId"]),
      "tenseEra.tenseEraId": new ObjectID(requestBody["tenseEraId"]),
      "tenseEra.stage.stageId": new ObjectID(requestBody["stageId"]),
    },
    {
      $set: {
        "tenseEra.$[].stage.$[].question.$[inner].isExplanation":
          requestBody["isExplanation"],
      },
    },
    {
      arrayFilters: [
        {
          "inner.questionBankId": new ObjectID(requestBody["questionId"]),
        },
      ],
    }
  );

  return updateAnswerExplanation;
};

module.exports = {
  retryGame,
  unlockStage,
  buyLives,
  createUserEraAnswerHistory,
  resetStageInUserAnswer,
  unlockStageWithoutSessionId,
  getStageSessionId,
  addNewStageSessionIdInUserAnswer,
  updateSessionEndTimeInUserAnswer,
  updateSessionIdStartTimeInUserAnswer,
  resetStage,
  updateExplanationStatusInUserAnsweredQuestion
};
