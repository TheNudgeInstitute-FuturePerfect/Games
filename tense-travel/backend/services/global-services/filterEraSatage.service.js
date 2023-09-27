const ObjectID = require("mongodb").ObjectId;

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
    { __v: 0, createdAt: 0, updatedAt: 0 }
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

const checkAttendingQuestionIsAnswered = async (model, requestBody)=> {
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
}

module.exports = {
  getLivesOfUnlockStage,
  filterStage,
  getGermsDetails,
  getUserDetails,
  updateUserDetails,
  checkAttendingQuestionIsAnswered
};
