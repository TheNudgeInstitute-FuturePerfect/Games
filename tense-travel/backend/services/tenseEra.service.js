const { eraTenseModel } = require("../models/index");
const { reponseModel } = require("../utils/responseHandler");
const httpStatusCodes = require("../utils/httpStatusCodes");
const { isEmpty, result } = require("lodash");
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
    // let eras = await eraTenseModel.find(
    //   {
    //     status: "active",
    //     type: "tense",
    //   },
    //   { _id: 1, title: 1, description: 1, sequence: 1, type: 1, stage: 1 }
    // );
    console.log(req.body);
    // let userAnswerData = await eraTenseModel.aggregate([
    //   {
    //     $lookup: {
    //       from: "user_answer_era_histories",
    //       localField: "stage._id",
    //       foreignField: "stageId",
    //       let: { userId: "userId" },
    //       // as: "stage.userAnswers",
    //       as: "userAnswers",
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               $eq: ["$userId", new ObjectID(req.body["userId"])],
    //             }, // Match user ID
    //           },
    //         },
    //       ],
    //     },
    //   },
    //   {
    //     $project: {
    //       title: 1,
    //       sequence: 1,
    //       type: 1,
    //       "stage._id": 1,
    //       "stage.title": 1,
    //       "stage.sequence": 1,
    //       "stage.type": 1,
    //       "stage.description": 1,
    //       "userAnswers._id": 1,
    //       "userAnswers._id": 1,
    //       "userAnswers.userAnswerEraId": 1,
    //       "userAnswers.userId": 1,
    //       "userAnswers.sessionId": 1,
    //       "userAnswers.tenseEraId": 1,
    //       "userAnswers.tenseEraTitle": 1,
    //       "userAnswers.stageId": 1,
    //       "userAnswers.earnStars": 1,
    //       "userAnswers.earnGerms": 1,
    //       "userAnswers.eraEarnGerms": 1,
    //       "userAnswers.stage": 1,
    //       // "userAnswers.questions": 0,
    //       "userAnswers.completedEra": 1,
    //     },
    //   },
    // ]);

    let userAnswerData = await eraTenseModel.aggregate([
      {
        $lookup: {
          from: "user_answer_era_histories",
          localField: "stage._id",
          foreignField: "stageId",
          let: { userId: "userId" },
          // as: "stage.userAnswers",
          as: "userAnswers",
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$userId", new ObjectID(req.body["userId"])],
                }, // Match user ID
              },
            },
          ],
        },
      },
      {
        $project: {
          title: 1,
          sequence: 1,
          type: 1,
          "stage._id": 1,
          "stage.title": 1,
          "stage.sequence": 1,
          "stage.type": 1,
          "stage.description": 1,
          "userAnswers._id": 1,
          "userAnswers._id": 1,
          "userAnswers.userAnswerEraId": 1,
          "userAnswers.userId": 1,
          "userAnswers.sessionId": 1,
          "userAnswers.tenseEraId": 1,
          "userAnswers.tenseEraTitle": 1,
          "userAnswers.stageId": 1,
          "userAnswers.earnStars": 1,
          "userAnswers.earnGerms": 1,
          "userAnswers.eraEarnGerms": 1,
          "userAnswers.stage": 1,
          // "userAnswers.questions": 0,
          "userAnswers.completedEra": 1,
        },
      },
    ]);

    // return reponseModel(
    //   httpStatusCodes.OK,
    //   userAnswerData ? "Era found" : "Era not found",
    //   userAnswerData ? true : false,
    //   userAnswerData,
    //   req,
    //   res
    // );

    let result1,
      calculateCompleted,
      totalMarks = 100,
      gettingMarks,
      perStageMarks,
      perQuestionMarks,
      totalQuestions = 10;
    let stageWiseAnswers = [];
    let matchedStageId;
    if (!isEmpty(userAnswerData)) {
      let userAnswers;
      let stage;
      perStageMarks = totalMarks / 3;
      perQuestionMarks = perStageMarks / totalQuestions;

      calculateCompleted = userAnswerData.map((value, index) => {
        stage = value["stage"];
        if (value["userAnswers"].length > 0) {
          // stage = value["stage"];
          userAnswers = value["userAnswers"];
          for (let i = 0; i < stage.length; i++) {
            const findd = userAnswers.find(
              (item, inx) =>
                item["stageId"].toString() === stage[i]["_id"].toString()
            );

            if (findd) {
              perStageMarks =
                perQuestionMarks * findd["stage"]?.numberOfCorrect;
              matchedStageId = findd["stage"]?.stageId;
            }
            for (let j = 0; j < userAnswers.length; j++) {
              // if (
              //   stage[i]["_id"].toString() ==
              //   userAnswers[j]["stageId"].toString()
              // ) {
              //   stageWiseAnswers.push(userAnswers[j]);
              //   stage[i]["stageWiseAnswers"] = stageWiseAnswers;
              //   stageWiseAnswers = [];
              // }
              //  else {
              //   stage[i]["stageWiseAnswers"] = [];
              // }
              // break;
              if (stage[i]["_id"].toString() == matchedStageId.toString()) {
                stage[i]["gotStageMarks"] = perStageMarks;
              } else {
                stage[i]["gotStageMarks"] = 0;
              }
            }
          }
        } else {
          for (let i = 0; i < stage.length; i++) {
            stage[i]["gotStageMarks"] = 0;
          }
        }
        delete value["userAnswers"];
        return value;
      });
    }

    return reponseModel(
      httpStatusCodes.OK,
      userAnswerData ? "Era found" : "Era not found",
      userAnswerData ? true : false,
      calculateCompleted,
      req,
      res
    );
  } catch (err) {
    next(err);
  }
};
