const { eraTenseModel, userAnswerEraModel } = require("../models/index");
const { reponseModel } = require("../utils/responseHandler");
const httpStatusCodes = require("../utils/httpStatusCodes");
const { isEmpty, result } = require("lodash");
const {
  checkStageIsAnswered,
} = require("./global-services/filterEraSatage.service");
const {
  resetStageInUserAnswer,
  getStageSessionId,
  addNewStageSessionIdInUserAnswer,
} = require("./answer/retryAttempt");
const ObjectID = require("mongodb").ObjectId;

exports.getAllEra = async (req, res, next) => {
  try {
    let eras = await eraTenseModel.find(
      {
        status: "active",
        type: "tense",
      },
      { _id: 1, title: 1, description: 1, sequence: 1, type: 1, stage: 1 }
    );

    return reponseModel(
      httpStatusCodes.OK,
      eras ? "Era found" : "Era not found",
      eras ? true : false,
      eras,
      req,
      res
    );
  } catch (err) {
    next(err);
  }
};

exports.findEra = async (req, res, next) => {
  try {
    let eras = await eraTenseModel.findOne(
      {
        status: "active",
        type: "tense",
        _id: req.params.id,
      },
      { _id: 1, title: 1, description: 1, sequence: 1, type: 1, stage: 1 }
    );

    return reponseModel(
      httpStatusCodes.OK,
      eras ? "Era found" : "Era not found",
      eras ? true : false,
      eras,
      req,
      res
    );
  } catch (err) {
    next(err);
  }
};

exports.getAllEraItsPercentage = async (req, res, next) => {
  try {
    userAnswerData = await eraTenseModel.aggregate([
      {
        $lookup: {
          from: "user_answer_era_histories",
          localField: "_id",
          foreignField: "tenseEraId",
          as: "userAnswers",
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$userId", new ObjectID(req.body["userId"])], // Match user ID
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          sequence: 1,
          type: 1,
          stage: {
            $map: {
              input: "$stage",
              as: "stage",
              in: {
                _id: "$$stage._id",
                title: "$$stage.title",
                description: "$$stage.description",
                sequence: "$$stage.sequence",
                userAnswer: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$userAnswers",
                        as: "answer",
                        cond: {
                          $eq: ["$$answer.stageId", "$$stage._id"],
                        },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
        },
      },
    ]);

    let calculateCompleted,
      totalMarks = 100,
      perStageMarks,
      totalQuestions = 10;
    if (!isEmpty(userAnswerData)) {
      perStageMarks = totalMarks / 3;
      perQuestionMarks = perStageMarks / totalQuestions;

      calculateCompleted = userAnswerData.map((value, index) => {
        return value["stage"].map((element, i) => {
          if ("userAnswer" in element) {
            element["gotStageMarks"] = perStageMarks;
          } else {
            element["gotStageMarks"] = 0;
          }
          delete element["userAnswer"];
          return value;
        });
      });
    } else {
      calculateCompleted = userAnswerData.map((value, index) => {
        return value["stage"].map((element, i) => {
          if ("userAnswer" in element) {
            element["gotStageMarks"] = perStageMarks;
          } else {
            element["gotStageMarks"] = 0;
          }
          delete element["userAnswer"];
          return value;
        });
      });
    }

    return reponseModel(
      httpStatusCodes.OK,
      userAnswerData ? "Era found" : "Era not found",
      userAnswerData ? true : false,
      userAnswerData,
      req,
      res
    );
  } catch (err) {
    next(err);
  }
};

exports.resetUserRecentStage = async (req, res, next) => {
  try {
    const requestBody = req.body;
    let stageData = await checkStageIsAnswered(userAnswerEraModel, requestBody);
    let sessionId, startTime;
    let resetRecentStage = {};
    if (!isEmpty(stageData)) {
      if (stageData[0]["tenseEra"][0]["stage"][0]?.completedStage) {
        resetRecentStage = await resetStageInUserAnswer(
          userAnswerEraModel,
          requestBody
        );

        if (
          !isEmpty(resetRecentStage) &&
          resetRecentStage?.acknowledged &&
          resetRecentStage?.modifiedCount === 1
        ) {
          //generating new session
          await addNewStageSessionIdInUserAnswer(
            userAnswerEraModel,
            requestBody
          );
          //getting new session
          sessionId = await getStageSessionId(userAnswerEraModel, requestBody);
          startTime = sessionId["startTime"];
          sessionId = sessionId["sessionId"];
          resetRecentStage["sessionId"] = sessionId;
          resetRecentStage["startTime"] = startTime;

          return reponseModel(
            httpStatusCodes.OK,
            "Stage reset successfully",
            true,
            resetRecentStage,
            req,
            res
          );
        } else {
          //getting old session
          sessionId = await getStageSessionId(userAnswerEraModel, requestBody);
          startTime = sessionId["startTime"];
          sessionId = sessionId["sessionId"];
          resetRecentStage["sessionId"] = sessionId;
          resetRecentStage["startTime"] = startTime;

          return reponseModel(
            httpStatusCodes.INTERNAL_SERVER,
            "Stage reset not successfully. Please try again",
            false,
            resetRecentStage,
            req,
            res
          );
        }
      } else {
        //fetching old session
        sessionId = await getStageSessionId(userAnswerEraModel, requestBody);
        startTime = sessionId["startTime"];
        sessionId = sessionId["sessionId"];

        if (!isEmpty(sessionId)) {
          resetRecentStage["sessionId"] = sessionId;
          resetRecentStage["startTime"] = startTime;
        } else {
          //generating new session
          await addNewStageSessionIdInUserAnswer(
            userAnswerEraModel,
            requestBody
          );
          //getting new session
          sessionId = await getStageSessionId(userAnswerEraModel, requestBody);
          startTime = sessionId["startTime"];
          sessionId = sessionId["sessionId"];
          resetRecentStage["sessionId"] = sessionId;
          resetRecentStage["startTime"] = startTime;
        }

        return reponseModel(
          httpStatusCodes.OK,
          "Stage is already reseted",
          true,
          resetRecentStage,
          req,
          res
        );
      }
    } else {
      resetRecentStage["sessionId"] = "";
      return reponseModel(
        httpStatusCodes.OK,
        "This stage is not answered",
        false,
        resetRecentStage,
        req,
        res
      );
    }
  } catch (err) {
    next(err);
  }
};
