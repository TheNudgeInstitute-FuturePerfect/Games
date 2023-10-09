import { API_END_POINT } from "../utils/endpoints";
import { API_ERROR_ESPONSE } from "../utils/payload";

const recentCompletedStageScore = async (requestPayload) => {
  try {
    let scoreData = await fetch(
      `${process.env.REACT_APP_API_URL}/${API_END_POINT.RECENT_STAGE_COMPLETED_SCORE}`,
      {
        method: "POST",
        body: JSON.stringify(requestPayload),
        headers: { "Content-Type": "application/json" },
      }
    );

    scoreData = await scoreData.json();
    return scoreData;
  } catch (error) {
    // API_ERROR_ESPONSE.message = "An error occurred";
    API_ERROR_ESPONSE.message = error.message || error;
    API_ERROR_ESPONSE.success = false;
    return API_ERROR_ESPONSE;
  }
};

export { recentCompletedStageScore };
