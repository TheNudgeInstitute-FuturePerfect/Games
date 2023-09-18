const { userModel } = require("./user.model");
const { profileRoleModel } = require("./profileRole.model");
const { buildResumeRuleModel } = require("./buildResumeRule.model");
const { userResumeInProgressModel } = require("./userResumeInProgress.model");
const { userResumeHistoryModel } = require("./userResumeHistory.model");
const { eraTenseModel } = require("./tense.model");
const { questoinBankModel } = require("./questionBank.model");
const { userAnswerEraModel } = require("./userAnswerEra.model");

module.exports = {
  userModel,
  profileRoleModel,
  buildResumeRuleModel,
  userResumeInProgressModel,
  userResumeHistoryModel,
  eraTenseModel,
  questoinBankModel,
  userAnswerEraModel,
};
