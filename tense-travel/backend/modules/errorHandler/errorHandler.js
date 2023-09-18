const httpStatusCodes = require("../../utils/httpStatusCodes");

const errorHandler = (err, req, res, next) => {
  const errStatus = err.statusCode || httpStatusCodes.BAD_REQUEST;
  const errMsg = err.message || "Bad request";

  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
  });
};

module.exports = errorHandler;
