const {
  userAnswerEraHisotryPayload,
} = require("./constants/payloadInterface/payload.interface");

const userAnswerEraHisotryPayloadReset = () => {
  userAnswerEraHisotryPayload.userAnswerEraId = "";
  userAnswerEraHisotryPayload.userId = "";
  userAnswerEraHisotryPayload.sessionId = "";
  userAnswerEraHisotryPayload.tenseEraId = "";
  userAnswerEraHisotryPayload.stageId = "";
  userAnswerEraHisotryPayload.earnStars = "";
  userAnswerEraHisotryPayload.earnGerms = "";
  userAnswerEraHisotryPayload.stage = {};
  userAnswerEraHisotryPayload.questions = [];
  userAnswerEraHisotryPayload.startTime = "";
  userAnswerEraHisotryPayload.endTime = "";
  userAnswerEraHisotryPayload.eraEarnGerms = 0;
  userAnswerEraHisotryPayload.completedEra = false;
};

const userAnswerEraHisotryPayloadPrepare = async (
  tenseStageDetail,
  requestBody
) => {
  delete tenseStageDetail[0]["tenseEra"][0]["stage"][0]["histories"];

  userAnswerEraHisotryPayload.userAnswerEraId = tenseStageDetail[0]["_id"];
  userAnswerEraHisotryPayload.userId = requestBody["userId"];
  userAnswerEraHisotryPayload.sessionId = requestBody["sessionId"];
  userAnswerEraHisotryPayload.tenseEraId = requestBody["tenseEraId"];
  userAnswerEraHisotryPayload.stageId = requestBody["stageId"];
  userAnswerEraHisotryPayload.earnStars =
    tenseStageDetail[0]["tenseEra"][0]["stage"][0]["earnStars"];
  userAnswerEraHisotryPayload.eraEarnGerms =
    tenseStageDetail[0]["tenseEra"][0]["earnGerms"];
  userAnswerEraHisotryPayload.questions =
    tenseStageDetail[0]["tenseEra"][0]["stage"][0]["question"];
  userAnswerEraHisotryPayload.startTime =
    tenseStageDetail[0]["tenseEra"][0]["stage"][0]["startTime"];
  userAnswerEraHisotryPayload.endTime =
    tenseStageDetail[0]["tenseEra"][0]["stage"][0]["endTime"];
  userAnswerEraHisotryPayload.earnGerms =
    tenseStageDetail[0]["tenseEra"][0]["stage"]["0"]["earnGerms"] +
    tenseStageDetail[0]["tenseEra"][0]["stage"]["0"]["defaultGerms"];
  userAnswerEraHisotryPayload.completedEra =
    tenseStageDetail[0]["tenseEra"][0]["completedEra"];

  delete tenseStageDetail[0]["tenseEra"][0]["stage"][0]["question"];
  userAnswerEraHisotryPayload.stage =
    tenseStageDetail[0]["tenseEra"][0]["stage"][0];

  userAnswerEraHisotryPayload.stage["tenseEraId"] = requestBody["tenseEraId"];
  return userAnswerEraHisotryPayload;
};

module.exports = {
  userAnswerEraHisotryPayloadReset,
  userAnswerEraHisotryPayloadPrepare,
};
