const { eraTenseModel, userAnswerEraModel } = require("../models/index");
const { reponseModel } = require("../utils/responseHandler");
const httpStatusCodes = require("../utils/httpStatusCodes");
const { isEmpty } = require("lodash");
const ObjectID = require("mongodb").ObjectId;

exports.getUserScore = async (req, res, next) => {
  try {
    const requestBody = req.body;

    let score = await userAnswerEraModel.aggregate([
      {
        $match: {
          userId: new ObjectID(requestBody["userId"]),
          sessionId: requestBody["sessionId"],
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
                              // $ne: ["$$this.retryCount", 0],
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
          earnGerms:1
        },
      },
    ]);

    return reponseModel(
      httpStatusCodes.OK,
      !isEmpty(score) ? "User score found" : "User score not found",
      !isEmpty(score) ? true : false,
      score,
      req,
      res
    );
  } catch (err) {
    next(err);
  }
};