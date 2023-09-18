const ObjectID = require("mongodb").ObjectId;

const getLivesOfUnlockStage = async (model, requestBody) => {
  const unlockStageLives = await model.aggregate([
    {
      $match: {
        userId: new ObjectID(requestBody["userId"]),
        sessionId: requestBody["sessionId"],
        "tenseEra.tenseEraId": new ObjectID(requestBody["tenseEraId"]),
        "tenseEra.stage.stageId": new ObjectID(requestBody["stageId"]),
        "tenseEra.stage.isLocked": true,
      },
    },
    {
      $addFields: {
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
