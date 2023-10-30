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
  updateSessionEndTimeInUserAnswer,
  updateSessionIdStartTimeInUserAnswer,
} = require("./answer/retryAttempt");
const {
  stageQuestionSize,
} = require("../utils/constants/payloadInterface/payload.interface");
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
    let sessionStartTime;
    let stageData = await checkStageIsAnswered(userAnswerEraModel, requestBody);
    let stageAttempt = 0;

    let sessionId, startTime;
    let resetRecentStage = {};
    if (!isEmpty(stageData)) {
      stageAttempt = parseInt(stageData[0]["tenseEra"][0]["stage"][0]?.attempt);
      requestBody["attempt"] = stageAttempt + 1;
      if (
        stageData[0]["tenseEra"][0]["stage"][0]?.completedStage &&
        stageData[0]["tenseEra"][0]["stage"][0]?.attemptQuestions ===
          stageQuestionSize.size
      ) {
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
          
          sessionStartTime = new Date(Date.now()).toISOString();
          requestBody["startTime"] = sessionStartTime;
          await addNewStageSessionIdInUserAnswer(
            userAnswerEraModel,
            requestBody
          );
          //getting new session
          sessionId = "";
          sessionId = await getStageSessionId(userAnswerEraModel, requestBody);
          startTime = sessionId[0]["tenseEra"][0]["stage"][0]?.startTime;
          sessionId = sessionId[0]["tenseEra"][0]["stage"][0]?.sessionId;
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
          sessionId = "";
          sessionId = await getStageSessionId(userAnswerEraModel, requestBody);
          startTime = sessionId[0]["tenseEra"][0]["stage"][0]?.startTime;
          sessionId = sessionId[0]["tenseEra"][0]["stage"][0]?.sessionId;
          resetRecentStage["sessionId"] = sessionId;
          resetRecentStage["startTime"] = startTime;

          return reponseModel(
            httpStatusCodes.INTERNAL_SERVER,
            "Stage reset not successfully. Please try again",
            true,
            resetRecentStage,
            req,
            res
          );
        }
      } else if (
        !stageData[0]["tenseEra"][0]["stage"][0]?.completedStage &&
        stageData[0]["tenseEra"][0]["stage"][0]?.attemptQuestions > 0 &&
        stageData[0]["tenseEra"][0]["stage"][0]?.sessionId !== null
      ) {
        sessionId = "";
        sessionId = await getStageSessionId(userAnswerEraModel, requestBody);
        startTime = sessionId[0]["tenseEra"][0]["stage"][0]?.startTime;
        sessionId = sessionId[0]["tenseEra"][0]["stage"][0]?.sessionId;
        resetRecentStage["sessionId"] = sessionId;
        resetRecentStage["startTime"] = startTime;

        const updateSessionQuery = {
          $set: {
            startTime: resetRecentStage["startTime"],
            sessionId: resetRecentStage["sessionId"],
          },
        };
        requestBody["query"] = updateSessionQuery;
        await updateSessionIdStartTimeInUserAnswer(
          userAnswerEraModel,
          requestBody
        );

        return reponseModel(
          httpStatusCodes.OK,
          "This stage is already reseted",
          true,
          resetRecentStage,
          req,
          res
        );
      } else if (
        !stageData[0]["tenseEra"][0]["stage"][0]?.completedStage &&
        stageData[0]["tenseEra"][0]["stage"][0]?.attemptQuestions === 0 &&
        stageData[0]["tenseEra"][0]["stage"][0]?.sessionId === null
      ) {
        sessionStartTime = new Date(Date.now()).toISOString();
        requestBody["startTime"] = sessionStartTime;

        await addNewStageSessionIdInUserAnswer(userAnswerEraModel, requestBody);
        sessionId = "";
        sessionId = await getStageSessionId(userAnswerEraModel, requestBody);
        startTime = sessionId[0]["tenseEra"][0]["stage"][0]?.startTime;
        sessionId = sessionId[0]["tenseEra"][0]["stage"][0]?.sessionId;
        resetRecentStage["sessionId"] = sessionId;
        resetRecentStage["startTime"] = startTime;

        return reponseModel(
          httpStatusCodes.OK,
          "This stage is already reseted",
          true,
          resetRecentStage,
          req,
          res
        );
      } else if (
        !stageData[0]["tenseEra"][0]["stage"][0]?.completedStage &&
        stageData[0]["tenseEra"][0]["stage"][0]?.attemptQuestions === 0 &&
        stageData[0]["tenseEra"][0]["stage"][0]?.sessionId
      ) {
        //getting old session
        sessionId = "";
        sessionId = await getStageSessionId(userAnswerEraModel, requestBody);

        startTime = sessionId[0]["tenseEra"][0]["stage"][0]?.startTime;
        sessionId = sessionId[0]["tenseEra"][0]["stage"][0]?.sessionId;
        resetRecentStage["sessionId"] = sessionId;
        resetRecentStage["startTime"] = startTime;

        const updateSessionQuery = {
          $set: {
            startTime: resetRecentStage["startTime"],
            sessionId: resetRecentStage["sessionId"],
          },
        };
        requestBody["query"] = updateSessionQuery;
        await updateSessionIdStartTimeInUserAnswer(
          userAnswerEraModel,
          requestBody
        );

        return reponseModel(
          httpStatusCodes.OK,
          "This stage is already reseted",
          true,
          resetRecentStage,
          req,
          res
        );
      } else {
        return reponseModel(
          httpStatusCodes.OK,
          "Something went wrong! Please try again",
          false,
          "",
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

exports.updateSessionEndTimeInUserAnswer = async (req, res, next) => {
  try {
    const requestBody = req.body;
    let sesionUpdatedData = await updateSessionEndTimeInUserAnswer(
      userAnswerEraModel,
      requestBody
    );

    if (
      !isEmpty(sesionUpdatedData) &&
      sesionUpdatedData?.acknowledged &&
      sesionUpdatedData?.modifiedCount === 1
    ) {
      let stageData = await checkStageIsAnswered(
        userAnswerEraModel,
        requestBody
      );
      return reponseModel(
        httpStatusCodes.OK,
        "",
        false,
        stageData,
        req,
        res
      );
    } else {
      return reponseModel(
        httpStatusCodes.OK,
        "Something went wrong",
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
