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

module.exports = { getLivesOfUnlockStage };
