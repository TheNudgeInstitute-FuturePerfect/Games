const { eraTenseModel, userModel } = require("../models/index");
const { reponseModel } = require("../utils/responseHandler");
const httpStatusCodes = require("../utils/httpStatusCodes");
const isEmpty = require("lodash.isempty");

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

exports.getTourStatus = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    let tourInfo = await userModel.findOne(
      {
        _id: userId,
      },
      { tourGuide: 1, tourGuideStep: 1 }
    );

    return reponseModel(
      httpStatusCodes.OK,
      !isEmpty(tourInfo) ? "Record found" : "Record not found",
      !isEmpty(tourInfo) ? true : false,
      tourInfo,
      req,
      res
    );
  } catch (err) {
    next(err);
  }
};

exports.updateTourStatus = async (req, res, next) => {
  try {
    const requestBody = req.body;
    const filter = { _id: requestBody["userId"] };
    const update = {
      $set: {
        tourGuideStep: requestBody["tourGuideStep"],
        tourGuide: requestBody["tourGuide"],
      },
    };
    const options = { upsert: true };
    let updateTourInfo = await userModel.updateOne(filter, update, options);

    return reponseModel(
      httpStatusCodes.OK,
      !isEmpty(updateTourInfo) ? "State updated" : "State not updated",
      !isEmpty(updateTourInfo) ? true : false,
      updateTourInfo,
      req,
      res
    );
  } catch (err) {
    next(err);
  }
};

exports.getUserCompletedLevels = async (req, res, next) => {
  try {
    const requestBody = req.body;
    const filter = { _id: requestBody["userId"] };
    const update = {
      $set: {
        tourGuideStep: requestBody["tourGuideStep"],
        tourGuide: requestBody["tourGuide"],
      },
    };
    const options = { upsert: true };
    let updateTourInfo = await userModel.updateOne(filter, update, options);

    return reponseModel(
      httpStatusCodes.OK,
      !isEmpty(updateTourInfo) ? "State updated" : "State not updated",
      !isEmpty(updateTourInfo) ? true : false,
      updateTourInfo,
      req,
      res
    );
  } catch (err) {
    next(err);
  }
};

exports.shareGameSessionDetail = async (req, res, next) => {
  try {
    const requestBody = req.body;

    return reponseModel(
      httpStatusCodes.OK,
      "Game session details",
      true,
      requestBody,
      req,
      res
    );
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const usersData = await userModel.find(
      {},
      {
        _id: 1,
        mobile: 1,
        earnGerms: 1,
        bonusGerms: 1,
        totalEarnGerms: 1,
        firstName: 1,
        lastName: 1,
      }
    );

    return reponseModel(
      httpStatusCodes.OK,
      !isEmpty(usersData) ? "All users" : "No users",
      !isEmpty(usersData) ? true : false,
      usersData,
      req,
      res
    );
  } catch (err) {
    next(err);
  }
};
