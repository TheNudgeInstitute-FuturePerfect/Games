const env = process.env.NODE_ENV;
const config = require(`${__dirname}/configuration`)[env];
const authRouter = require("../routes/auth");
const eraRouter = require("../routes/era");
const questionBankRouter = require("../routes/questionBank.route");
const userAnswerEraRouter = require("../routes/userAnswerEra.route");
const scoreRouter = require("../routes/socre.route");
const coinRouter = require("../routes/coin.route");
const userRouter = require("../routes/user.route");
const userAnswerEraHistoryRouter = require("../routes/userAnswerEraHistory.route");

const apiBaseURL = `${config.api?.API_BASE_URL}/${config.api?.API_VERSION}`;

exports.routeConfig = async (application) => {
  application.use(`/${apiBaseURL}/auth`, authRouter.router);
  application.use(`/${apiBaseURL}/era`, eraRouter.router);
  application.use(`/${apiBaseURL}/question`, questionBankRouter.router);
  application.use(`/${apiBaseURL}/userEra`, userAnswerEraRouter.router);
  application.use(`/${apiBaseURL}/score`, scoreRouter.router);
  application.use(`/${apiBaseURL}/coin`, coinRouter.router);
  application.use(`/${apiBaseURL}/user`, userRouter.router);
  application.use(`/${apiBaseURL}/userAnswerEraHistory`, userAnswerEraHistoryRouter.router);

  return application;
};
