class BaseError extends Error {
  constructor(name, httpCode, success, message) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.description = message
    this.success = success;
    this.data = {},
    this.callId =  new Date().getTime(),

    Error.captureStackTrace(this);
  }
}

module.exports = BaseError;
