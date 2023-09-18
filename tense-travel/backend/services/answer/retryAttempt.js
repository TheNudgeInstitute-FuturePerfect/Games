const {
  heartLives,
} = require("../../utils/constants/payloadInterface/payload.interface");

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
        "tenseEra.$[].stage.$.histories": historyPayload,
      },
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
        "tenseEra.$[].stage.$[isCorrect].earnStars": false,
        "tenseEra.$[].stage.$[isCorrect].earnGerms": false,
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

module.exports = { retryGame, unlockStage };
