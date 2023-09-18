const httpStatusCodes = require("../../utils/httpStatusCodes");
const BaseError = require("./baseError");

class Api404Error extends BaseError {
  constructor(
    name,
    httpCode = httpStatusCodes.INTERNAL_SERVER,
    isOperational = true,
    description = "internal server error"
  ) {
    super(name, httpCode, description, isOperational);
  }
}

module.exports = Api404Error;
