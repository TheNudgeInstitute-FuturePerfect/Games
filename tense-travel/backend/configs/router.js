const env = process.env.NODE_ENV;
const config = require(`${__dirname}/configuration`)[env];
const userRouter = require("../routes/auth");
const profileRoleRouter = require("../routes/profileRole");
const eraRouter = require("../routes/era");
const questionBankRouter = require("../routes/questionBank.route");
const userAnswerEraRouter = require("../routes/userAnswerEra.route");

const apiBaseURL = `${config.api?.API_BASE_URL}/${config.api?.API_VERSION}`;

exports.routeConfig = async (application) => {
  application.use(`/${apiBaseURL}/auth`, userRouter.router);
  application.use(`/${apiBaseURL}/profileRole`, profileRoleRouter.router);
  application.use(`/${apiBaseURL}/era`, eraRouter.router);
  application.use(`/${apiBaseURL}/question`, questionBankRouter.router);
  application.use(`/${apiBaseURL}/userEra`, userAnswerEraRouter.router);

  return application;
};
