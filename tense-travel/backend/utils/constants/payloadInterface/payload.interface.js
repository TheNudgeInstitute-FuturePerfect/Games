// const { userAnswerEraModel } = require("../../../models/index");
// const { userAnswerEraModel } = require("../../../models/userAnswerEra.model");
const ObjectID = require("mongodb").ObjectId;

const answerPayload = {
  questionBankId: "",
  question: "",
  answer: "",
  userAnswer: "",
  isCorrect: "",
  startTime: "",
  endTime: "",
};

const answerResponseFormat = {
  completedEra: false,
  completedStage: false,
  nextQuestion: false,
  heartLive: 0,
  isCorrect: null,
  isError: false,
  isGameOver: false,
  isLivePurchased: false,
  sessionEndTime: "",
  sessionStartTime: "",
};

const userAnswerEraHisotryPayload = {
  userAnswerEraId: "",
  userId: "",
  sessionId: "",
  tenseEraId: "",
  tenseEraTitle: "",
  stageId: "",
  earnStars: "",
  earnGerms: "",
  stage: {},
  questions: [],
  startTime: "",
  endTime: "",
  eraEarnGerms: 0,
  completedEra: false,
  attempt: 0,
};

const heartLives = {
  live: 3,
};

const stageQuestionSize = {
  size: 10,
};

const earningCoinsRule = {
  stars: {
    oneStars: {
      accurate: 8,
      star: 1,
    },
    twoStars: {
      accurate: 9,
      star: 2,
    },
    threeStars: {
      accurate: 10,
      star: 3,
    },
  },
  germs: {
    accurate: 10,
    germ: 1,
  },
  signupBonusCoins: {
    coin: 20,
  },
  coins: {
    lives: 1, //one live = 5 coins. If user have 2 lives then 2*5=10 coins
    defaultCoins: 5, // 5 coins will be default. If Stage completed then 5 coins will be default
  },
  buyLives: {
    coin: 10,
    lives: 1, //buy 1 lives spending by 10 coins
  },
};

//calculate earning coins
const earningCoins = (live) => {
  let res;
  if (live === 0) {
    res = earningCoinsRule.coins.defaultCoins;
  } else {
    res = parseInt(live) * parseInt(earningCoinsRule.coins.defaultCoins);
  }
  return res;
};

const stageFilter = (params) => {
  let stages = null;
  let eras = null;
  let answerCount = JSON.parse(JSON.stringify(params?.answerCount["tenseEra"]));
  answerCount.find((era, index) => {
    if (era?.tenseEraId === params?.requestBody["tenseEraId"]) {
      eras = era?.earnGerms;
      era["stage"].some((stage, indx) => {
        if (stage?.stageId === params?.requestBody["stageId"]) {
          stages = stage;
        }
      });
    }
  });
  return stages;
};

const stageAndQuestionFilter = (params) => {
  let stages = null;
  let userAnswerDetail = null;

  let answerExists = JSON.parse(
    JSON.stringify(params?.answerExists["tenseEra"])
  );
  answerExists.find((era, index) => {
    if (era?.tenseEraId === params?.requestBody["tenseEraId"]) {
      era["stage"].some((stage, indx) => {
        if (stage?.stageId === params?.requestBody["stageId"]) {
          stages = stage;
          if (stage.question.length > 0) {
            stage?.question.find((ques, i) => {
              if (ques.questionBankId === params?.requestBody["questionId"]) {
                userAnswerDetail = ques;
              }
            });
          }
        }
      });
    }
  });
  return { stages, userAnswerDetail };
};

//calculate stars
const earnCoins = (params, live = 0) => {
  let coin = { stars: 0, germs: 0, userGerms: 0, eraGerms: 0 };
  switch (params?.numberOfCorrect) {
    case earningCoinsRule.stars.oneStars.accurate:
      coin.stars = earningCoinsRule.stars.oneStars.star;
      break;
    case earningCoinsRule.stars.twoStars.accurate:
      coin.stars = earningCoinsRule.stars.twoStars.star;
      break;
    case earningCoinsRule.stars.threeStars.accurate:
      coin.stars = earningCoinsRule.stars.threeStars.star;
      // coin.germs = earningCoinsRule.germs.germ;
      break;
    default:
      coin.stars = 0;
    // coin.germs = 0;
  }
  coin.germs = earningCoins(live);
  return coin;
};

const updateCoins = async (requestBody, coinObj) => {
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
    await model.updateOne(
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

const eraFilter = (params) => {
  let era = null;
  let tenseEra = JSON.parse(JSON.stringify(params?.tenseEra));
  tenseEra.find((era, index) => {
    if (era?.tenseEraId === params?.requestBody["tenseEraId"]) {
      tenseEra = era;
      // era["stage"].some((stage, indx) => {
      //   if (stage?.stageId === params?.requestBody["stageId"]) {
      //     stages = stage;
      //   }
      // });
    }
  });
  return tenseEra;
};

const userAnswerStages = async (model, requestBody) => {
  const userAnswerStage = await model.aggregate([
    {
      $match: {
        userId: new ObjectID(requestBody["userId"]),
        sessionId: requestBody["sessionId"],
        "tenseEra.tenseEraId": new ObjectID(requestBody["tenseEraId"]),
        "tenseEra.stage.stageId": new ObjectID(requestBody["stageId"]),
      },
    },
    {
      $project: {
        tenseEra: {
          $filter: {
            input: {
              $map: {
                input: "$tenseEra",
                in: {
                  $mergeObjects: [
                    "$$this",
                    {
                      stage: {
                        $filter: {
                          input: "$$this.stage",
                          cond: {
                            $eq: [
                              "$$this.stageId",
                              new ObjectID(requestBody["stageId"]),
                            ],
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
            cond: { $ne: ["$$this.stage", []] },
          },
        },
      },
    },
  ]);

  return userAnswerStage;
};

module.exports = {
  answerPayload,
  stageFilter,
  stageAndQuestionFilter,
  earnCoins,
  updateCoins,
  answerResponseFormat,
  heartLives,
  eraFilter,
  userAnswerStages,
  stageQuestionSize,
  earningCoinsRule,
  userAnswerEraHisotryPayload,
};
