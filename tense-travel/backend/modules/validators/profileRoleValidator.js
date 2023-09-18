const Joi = require("joi");
const errorHandler = require("../../utils/responseHandler");
const httpStatusCodes = require("../../utils/httpStatusCodes");

const roleTitle = Joi.object().keys({
  title: Joi.string().required(),
});
const roleObj = {
  profileRole: Joi.array().items(roleTitle).min(1).required(),
};

const roleSchema = Joi.object(roleObj);
roleSchema.validate({});

const profileRoleValidator = async (req, res, next) => {
  try {
    let payload = req.body;
    await roleSchema.validateAsync(payload, { abortEarly: false });
    next();
  } catch (error) {
    errorHandler.handle(httpStatusCodes.BAD_REQUEST, error, false, req, res);
  }
};
/* update role */
const updateRoleObj = {
  title: Joi.string().required(),
};

const updateRoleSchema = Joi.object(updateRoleObj);
updateRoleSchema.validate({});

const updateRoleValidator = async (req, res, next) => {
  try {
    let payload = req.body;
    await updateRoleSchema.validateAsync(payload);
    next();
  } catch (error) {
    const errMsg = error["details"][0]?.message || "";
    errorHandler.handle(httpStatusCodes.BAD_REQUEST, errMsg, false, req, res);
  }
};

/* status role */
const statusRoleObj = {
  status: Joi.string().valid("active", "inactive", "deleted").required(),
};

const statusRoleSchema = Joi.object(statusRoleObj);
statusRoleSchema.validate({});

const deleteRoleValidator = async (req, res, next) => {
  try {
    let payload = req.body;
    await statusRoleSchema.validateAsync(payload);
    next();
  } catch (error) {
    const errMsg = error["details"][0]?.message || "";
    errorHandler.handle(httpStatusCodes.BAD_REQUEST, errMsg, false, req, res);
  }
};

module.exports = {
  profileRoleValidator,
  updateRoleValidator,
  deleteRoleValidator,
};
