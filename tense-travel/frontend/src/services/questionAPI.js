import { API_END_POINT } from "../utils/endpoints";
import { buyLivesPaylod } from "../utils/payload";

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

export { buyLives, reTryStage };
