const { isEmpty } = require("lodash");
const {
  userAnswerEraHistoryModel,
} = require("../../models/userAnswerEraHistory.model");
const { userAnswerEraModel } = require("../../models");

const ObjectID = require("mongodb").ObjectId;
const { v4: uuidv4 } = require("uuid");

const getLivesOfUnlockStage = async (model, requestBody) => {
  const unlockStageLives = await model.aggregate([
    {
      $match: {
        userId: new ObjectID(requestBody["userId"]),
        sessionId: requestBody["sessionId"],
        tenseEra: {
          $elemMatch: {
            tenseEraId: new ObjectID(requestBody["tenseEraId"]),
            stage: {
              $elemMatch: {
                stageId: new ObjectID(requestBody["stageId"]),
                isLocked: false,
              },
            },
          },
        },
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
  return unlockStageLives;
};

const filterStage = async (model, requestBody) => {
  const unlockStageLives = await model.aggregate([
    {
      $match: {
        userId: new ObjectID(requestBody["userId"]),
        sessionId: requestBody["sessionId"],
        tenseEra: {
          $elemMatch: {
            tenseEraId: new ObjectID(requestBody["tenseEraId"]),
            // stage: {
            //   $elemMatch: {
            //     isLocked: true,
            //   },
            // },
          },
        },
      },
    },
    {
      $project: {
        tenseEra: {
          $filter: {
            input: "$tenseEra",
            as: "tenseEra",
            cond: {
              $eq: [
                "$$tenseEra.tenseEraId",
                new ObjectID(requestBody["tenseEraId"]),
              ],
            },
          },
        },
      },
    },
  ]);
  return unlockStageLives;
};

const getGermsDetails = async (model, requestBody) => {
  let userGermsDetails = await model.aggregate([
    {
      $match: {
        userId: new ObjectID(requestBody["userId"]),
        sessionId: requestBody["sessionId"],
        tenseEra: {
          $elemMatch: {
            tenseEraId: new ObjectID(requestBody["tenseEraId"]),
            stage: {
              $elemMatch: {
                stageId: new ObjectID(requestBody["stageId"]),
                question: {
                  $elemMatch: {
                    questionBankId: new ObjectID(requestBody["questionId"]),
                  },
                },
              },
            },
          },
        },
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
        earnGerms: 1,
      },
    },
  ]);
  return userGermsDetails;
};

const getUserDetails = async (model, userId) => {
  const userDetails = await model.findOne(
    {
      _id: new ObjectID(userId),
    },
    { __v: 0, createdAt: 0, updatedAt: 0, password: 0 }
  );
  return userDetails;
};

const updateUserDetails = async (model, userId, updateObj) => {
  const updateDetails = await model.findOneAndUpdate(
    {
      _id: new ObjectID(userId),
    },
    updateObj,
    { upsert: true }
  );
  return updateDetails;
};

const checkAttendingQuestionIsAnswered = async (model, requestBody) => {
  const answerExists = await model.aggregate([
    {
      $match: {
        userId: new ObjectID(requestBody["userId"]),
        sessionId: requestBody["sessionId"],
        tenseEra: {
          $elemMatch: {
            tenseEraId: new ObjectID(requestBody["tenseEraId"]),
            stage: {
              $elemMatch: {
                stageId: new ObjectID(requestBody["stageId"]),
                question: {
                  $elemMatch: {
                    questionBankId: new ObjectID(requestBody["questionId"]),
                  },
                },
              },
            },
          },
        },
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

  return answerExists;
};

const getRecentUserAnswerDetail = async (model, requestBody) => {
  const tenseStageDetail = await model.findOne({
    userId: requestBody["userId"],
    sessionId: requestBody["sessionId"],
    "tenseEra.tenseEraId": requestBody["tenseEraId"],
    "tenseEra.stage.stageId": requestBody["stageId"],
  });
  return tenseStageDetail;
};

const checkStageIsAnswered = async (model, requestBody) => {
  const unlockStageLives = await model.aggregate([
    {
      $match: {
        userId: new ObjectID(requestBody["userId"]),
        tenseEra: {
          $elemMatch: {
            // tenseEraId: new ObjectID(requestBody["tenseEraId"]),
            stage: {
              $elemMatch: {
                stageId: new ObjectID(requestBody["stageId"]),
              },
            },
          },
        },
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
        earnGerms: 1,
      },
    },
  ]);
  return unlockStageLives;
};

const checkUserIsInUserAnswerModel = async (req, res, next) => {
  try {
    const requestBody = req.body;
    const userData = await userAnswerEraModel.findOne(
      {
        userId: requestBody["userId"],
      },
      {
        _id: 1,
        userId: 1,
        tenseEra: 1,
      }
    );

    return userData;
  } catch (error) {
    next(error);
  }
};

const checkCurrentStageIsInUserAnswerModel = async (req, res, next) => {
  try {
    const requestBody = req.body;
    const userData = await userAnswerEraModel.findOne(
      {
        userId: new ObjectID(requestBody["userId"]),
        "tenseEra.tenseEraId": new ObjectID(requestBody["tenseEraId"]),
      },
      {
        _id: 1,
        userId: 1,
        'tenseEra.$': 1,
      }
    );

    return userData;
  } catch (error) {
    next(error);
  }
};

const getHighestStarsStage = async (req, res, next) => {
  try {
    const requestBody = req.body;

    let userAnswerData = await userAnswerEraHistoryModel.aggregate([
      {
        $match: {
          tenseEraId: new ObjectID(requestBody["tenseEraId"]),
          // stageId: new ObjectID(requestBody["stageId"]),
          userId: new ObjectID(requestBody["userId"]),
        },
      },
      {
        $sort: {
          earnStars: -1,
          // stageId: 1,
        },
      },
      {
        $group: {
          _id: {
            stageId: "$stageId",
            tenseEraId: "$tenseEraId",
          },
          doc: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: {
          newRoot: "$doc",
        },
      },
      {
        $project: {
          _id: 1,
          userAnswerEraId: 1,
          userId: 1,
          sessionId: 1,
          tenseEraId: 1,
          tenseEraTitle: 1,
          stageId: 1,
          earnStars: 1,
          earnGerms: 1,
          eraEarnGerms: 1,
          stage: 1,
        },
      },
    ]);

    userAnswerData = userAnswerData.sort(function (a, b) {
      return a?.stage?.sequence - b?.stage?.sequence;
    });

    return userAnswerData;
  } catch (error) {
    next(error);
  }
};

const preparingHighestStarsResponse = (
  getHighestStarStage,
  userAndSessionInUserAnswer
) => {
  //getting stage
  getHighestStarStage = getHighestStarStage.map(
    (value, index) => value["stage"]
  );

  //filtering attended, un attended stages and making response
  const unAttendedStages = userAndSessionInUserAnswer["tenseEra"][0][
    "stage"
  ].filter((stage, index) => {
    return !getHighestStarStage.some((object2) => {
      return stage?.stageId.toString() === object2?.stageId.toString();
    });
  });

  getHighestStarStage = [...getHighestStarStage, ...unAttendedStages];
  let userAndSessionInUserAnswerData = userAndSessionInUserAnswer;
  userAndSessionInUserAnswerData =
    userAndSessionInUserAnswerData["tenseEra"][0];
  userAndSessionInUserAnswerData["stage"] = getHighestStarStage;

  return userAndSessionInUserAnswerData;
};

const filterStageWithoutSession = async (model, requestBody) => {
  const unlockStageLives = await model.aggregate([
    {
      $match: {
        userId: new ObjectID(requestBody["userId"]),
        tenseEra: {
          $elemMatch: {
            tenseEraId: new ObjectID(requestBody["tenseEraId"]),
            // stage: {
            //   $elemMatch: {
            //     isLocked: true,
            //   },
            // },
          },
        },
      },
    },
    {
      $project: {
        tenseEra: {
          $filter: {
            input: "$tenseEra",
            as: "tenseEra",
            cond: {
              $eq: [
                "$$tenseEra.tenseEraId",
                new ObjectID(requestBody["tenseEraId"]),
              ],
            },
          },
        },
      },
    },
  ]);
  return unlockStageLives;
};

const generateSessionId = async () => {
  const sessionId = await uuidv4();
  return sessionId;
};

module.exports = {
  getLivesOfUnlockStage,
  filterStage,
  getGermsDetails,
  getUserDetails,
  updateUserDetails,
  checkAttendingQuestionIsAnswered,
  getRecentUserAnswerDetail,
  checkStageIsAnswered,
  checkUserIsInUserAnswerModel,
  getHighestStarsStage,
  preparingHighestStarsResponse,
  checkCurrentStageIsInUserAnswerModel,
  filterStageWithoutSession,
  generateSessionId
};
