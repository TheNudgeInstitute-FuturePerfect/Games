import { API_END_POINT } from "../utils/endpoints";
import { API_ERROR_ESPONSE, buyLivesPaylod } from "../utils/payload";

const buyLives = async (requestPayload) => {
  let questionsData = await fetch(
    `${process.env.REACT_APP_API_URL}/${API_END_POINT.BUY_STAGE_LIVES}`,
    {
      method: "POST",
      body: JSON.stringify(requestPayload),
      headers: { "Content-Type": "application/json" },
    }
  );
  buyLivesPaylod.userId = "";
  buyLivesPaylod.sessionId = "";
  buyLivesPaylod.stageId = "";
  buyLivesPaylod.tenseEraId = "";
  questionsData = await questionsData.json();
  return questionsData;
};

const reTryStage = async (requestPayload) => {
  let questionsData = await fetch(
    `${process.env.REACT_APP_API_URL}/userEra/user-retry-stage`,
    {
      method: "POST",
      body: JSON.stringify(requestPayload),
      headers: { "Content-Type": "application/json" },
    }
  );
  questionsData = await questionsData.json();
  return questionsData;
};

const resetUserRecentStage = async (requestPayload) => {
  delete requestPayload["sessionId"];
  let resetStage = await fetch(
    `${process.env.REACT_APP_API_URL}/${API_END_POINT.RESET_USER_RECENT_STAGE}`,
    {
      method: "POST",
      body: JSON.stringify(requestPayload),
      headers: { "Content-Type": "application/json" },
    }
  );

  resetStage = await resetStage.json();
  return resetStage;
};

const shareGameSessionDetail = async (requestPayload) => {
  let resetStage = await fetch(
    `${process.env.REACT_APP_API_URL}/${API_END_POINT.SHARE_GAME_SESSION_DETAIL}/${requestPayload["Mobile"]}`,
    {
      method: "PATCH",
      body: JSON.stringify(requestPayload),
      headers: { "Content-Type": "application/json" },
    }
  );

  resetStage = await resetStage.json();
  return resetStage;
};

export { buyLives, reTryStage, resetUserRecentStage, shareGameSessionDetail };
