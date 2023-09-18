const isEmpty = require("lodash.isempty");
const { profileRoleModel } = require("../models/index");
const { reponseModel, errorHandler } = require("../utils/responseHandler");
const httpStatusCodes = require("../utils/httpStatusCodes");
const { upperFirst } = require("lodash");

exports.create = async (payload, req, res, next) => {
  try {
    const roleTitle = payload["profileRole"].map((item) => item.title);

    let existsRole = await profileRoleModel.findOne({
      title: { $in: roleTitle },
    });

    if (!isEmpty(existsRole)) {
      return reponseModel(
        httpStatusCodes.OK,
        "Role already exists",
        false,
        "",
        req,
        res
      );
    } else {
      await profileRoleModel.insertMany(payload["profileRole"]);

      return reponseModel(
        httpStatusCodes.OK,
        "Role created success",
        true,
        "",
        req,
        res
      );
    }
  } catch (err) {
    next(err);
  }
};

exports.findAll = async (req, res, next) => {
  try {
    let roles = await profileRoleModel.find(
      { status: "active" },
      {
        _id: 1,
        title: 1,
      }
    );

    return reponseModel(
      httpStatusCodes.OK,
      "Role found",
      true,
      roles,
      req,
      res
    );
  } catch (err) {
    errorHandler(
      err,
      httpStatusCodes.BAD_REQUEST,
      "Something went wrong",
      false,
      "",
      res
    );
  }
};

exports.findOne = async (req, res, next) => {
  try {
    let roles = await profileRoleModel.findOne(
      { status: "active", _id: req.params.id },
      {
        _id: 1,
        title: 1,
      }
    );

    return reponseModel(
      httpStatusCodes.OK,
      "Role found",
      true,
      roles,
      req,
      res
    );
  } catch (err) {
    errorHandler(
      err,
      httpStatusCodes.BAD_REQUEST,
      "Something went wrong",
      false,
      "",
      res
    );
  }
};

exports.update = async (req, res, next) => {
  try {
    const update = await profileRoleModel.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { upsert: true }
    );
    return reponseModel(
      httpStatusCodes.OK,
      "Updated success",
      true,
      "",
      req,
      res
    );
  } catch (err) {
    errorHandler(
      err,
      httpStatusCodes.BAD_REQUEST,
      "Something went wrong",
      false,
      "",
      res
    );
  }
};

exports.deleteRole = async (req, res, next) => {
  try {
    await profileRoleModel.findOneAndUpdate({ _id: req.params.id }, req.body, {
      upsert: true,
    });
    return reponseModel(
      httpStatusCodes.OK,
      `${upperFirst(req.body.status)} success`,
      true,
      "",
      req,
      res
    );
  } catch (err) {
    errorHandler(
      err,
      httpStatusCodes.BAD_REQUEST,
      "Something went wrong",
      false,
      "",
      res
    );
  }
};
