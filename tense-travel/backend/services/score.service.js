const { eraTenseModel, userAnswerEraModel } = require("../models/index");
const { reponseModel } = require("../utils/responseHandler");
const httpStatusCodes = require("../utils/httpStatusCodes");
const { isEmpty } = require("lodash");
const {
  getLivesOfUnlockStage,
  getInCompletedStages,
} = require("./global-services/filterEraSatage.service");
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
          earnGerms: 1,
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

exports.recentStageCompletedScore = async (req, res, next) => {
  try {
    const requestBody = req.body;

    let scoreData = await getLivesOfUnlockStage(
      userAnswerEraModel,
      requestBody
    );

    if (!isEmpty(scoreData)) {
      delete scoreData[0]["tenseEra"][0]["stage"][0]["question"];
      delete scoreData[0]["tenseEra"][0]["stage"][0]["histories"];

      return reponseModel(
        httpStatusCodes.OK,
        "User score found",
        true,
        scoreData,
        req,
        res
      );
    } else {
      return reponseModel(
        httpStatusCodes.OK,
        "User score not found",
        false,
        "",
        req,
        res
      );
    }
  } catch (err) {
    next(err);
  }
};

exports.getInCompletedStages = async (req, res, next) => {
  try {
    const requestBody = req.body;

    let stagesData = await getInCompletedStages(
      userAnswerEraModel,
      requestBody
    );

    if (!isEmpty(stagesData)) {
      return reponseModel(
        httpStatusCodes.OK,
        "Record found",
        true,
        stagesData,
        req,
        res
      );
    } else {
      return reponseModel(
        httpStatusCodes.OK,
        "Record not found",
        false,
        stagesData,
        req,
        res
      );
    }
  } catch (err) {
    next(err);
  }
};
