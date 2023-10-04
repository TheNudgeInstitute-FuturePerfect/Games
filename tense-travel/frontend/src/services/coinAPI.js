import { API_END_POINT } from "../utils/endpoints";
import { API_ERROR_ESPONSE } from "../utils/payload";

const getUserCoins = async (requestPayload) => {
  try {
    let userCoins = await fetch(
      `${process.env.REACT_APP_API_URL}/${API_END_POINT.GET_USER_COINS}/${requestPayload.userId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    userCoins = await userCoins.json();
    return userCoins;
  } catch (error) {
    // API_ERROR_ESPONSE.message = "An error occurred";
    API_ERROR_ESPONSE.message = error.message || error;
    API_ERROR_ESPONSE.success = false;
    return API_ERROR_ESPONSE;
  }
};

export { getUserCoins };
