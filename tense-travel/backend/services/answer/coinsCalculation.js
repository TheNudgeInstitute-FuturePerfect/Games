const {
  earningCoinsRule,
} = require("../../utils/constants/payloadInterface/payload.interface");

const updateCoin = async (model, requestBody, coinObj) => {
  const updateCoin = await model.updateOne(
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

  if (updateCoin?.modifiedCount > 0 && updateCoin?.acknowledged === true) {
    await model.updateOne(
      {
        userId: requestBody["userId"],
        sessionId: requestBody["sessionId"],
        "tenseEra.tenseEraId": requestBody["tenseEraId"],
      },
      {
        $set: {
          "tenseEra.$[coins].earnGerms": coinObj["eraGerms"],
          earnGerms: coinObj["userSessionGerms"],
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

module.exports = { updateCoin };
