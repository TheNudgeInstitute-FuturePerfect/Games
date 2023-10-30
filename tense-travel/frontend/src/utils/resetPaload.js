const {
  shareGameSessionDetailPayload,
  stageSessionEndTimeDetail,
} = require("./payload");

const shareGameSessionDetailPayloadReset = () => {
  shareGameSessionDetailPayload.Mobile = "";
  shareGameSessionDetailPayload.Type = "";
  shareGameSessionDetailPayload.SessionID = "";
  shareGameSessionDetailPayload.SessionStartTime = "";
  shareGameSessionDetailPayload.SessionEndTime = "";
  shareGameSessionDetailPayload.SessionComplete = "";
  shareGameSessionDetailPayload.TimeSpent = "";
};

const stageSessionEndTimeDetailReset = () => {
  stageSessionEndTimeDetail.SessionEndTime = "";
  stageSessionEndTimeDetail.SessionComplete = "";
  stageSessionEndTimeDetail.TimeSpent = "";
};

module.exports = {
  shareGameSessionDetailPayloadReset,
  stageSessionEndTimeDetailReset,
};
