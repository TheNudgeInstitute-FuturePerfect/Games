const _ = require("lodash");

module.exports = {
  handle: function (status, errorMessage, success, req, res) {
    if (errorMessage) {
      res.status(status).json({
        message: errorMessage,
        success: success,
        callId: new Date().getTime(),
        data: {},
      });
    }
  },
  handleSuccess: function (response, req, res) {
    if (response != undefined)
      res.status(response.statusCode).json({
        message: response.message,
        success: response.success,
        callId: new Date().getTime(),
        data: response.data ? response.data : {},
      });
  },
  reponseModel: function (statusCode, message, success, data, req, res) {
    return {
      statusCode: _.isUndefined(statusCode) ? 200 : statusCode,
      message,
      success,
      data: data ? data : {},
    };
  },
  errorHandler: function (error, statusCode, message, success, data, res) {
    res.status(statusCode).json({
      message: message,
      success: success,
      callId: new Date().getTime(),
      data: {} || data,
      stack: process.env.NODE_ENV === "development" ? error.stack : {},
    });
  },
};
