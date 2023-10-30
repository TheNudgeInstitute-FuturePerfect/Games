const { shareGameSessionDetailPayload } = require("./payload");

const shareGameSessionDetailPayloadReset = () => {
  shareGameSessionDetailPayload.Mobile = "";
  shareGameSessionDetailPayload.Type = "";
  shareGameSessionDetailPayload.SessionID = "";
  shareGameSessionDetailPayload.SessionStartTime = "";
  shareGameSessionDetailPayload.SessionEndTime = "";
  shareGameSessionDetailPayload.SessionComplete = "";
  shareGameSessionDetailPayload.TimeSpent = "";
};

module.exports = { shareGameSessionDetailPayloadReset };
