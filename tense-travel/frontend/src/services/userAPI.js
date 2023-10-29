import { API_END_POINT } from "../utils/endpoints";
import { API_ERROR_ESPONSE } from "../utils/payload";

const userTourStatus = async (userId) => {
  try {
    let tourStatusData = await fetch(
      `${process.env.REACT_APP_API_URL}/${API_END_POINT.USER_TOUR_STATUS}/${userId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    tourStatusData = await tourStatusData.json();
    return tourStatusData;
  } catch (error) {
    API_ERROR_ESPONSE.message = error.message || error;
    API_ERROR_ESPONSE.success = false;
    return API_ERROR_ESPONSE;
  }
};

const updateUserTourStatus = async (payload) => {
  try {
    let updateTourStatus = await fetch(
      `${process.env.REACT_APP_API_URL}/${API_END_POINT.UPDATE_USER_TOUR_STATUS}/${payload["userId"]}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      }
    );

    updateTourStatus = await updateTourStatus.json();
    return updateTourStatus;
  } catch (error) {
    API_ERROR_ESPONSE.message = error.message || error;
    API_ERROR_ESPONSE.success = false;
    return API_ERROR_ESPONSE;
  }
};

const checkUserByMobile = async (payload) => {
  try {
    let checkUser = await fetch(
      `${process.env.REACT_APP_API_URL}/${API_END_POINT.CHECK_USER_BY_MOBILE}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      }
    );

    checkUser = await checkUser.json();
    return checkUser;
  } catch (error) {
    API_ERROR_ESPONSE.message = error.message || error;
    API_ERROR_ESPONSE.success = false;
    return API_ERROR_ESPONSE;
  }
};

export { userTourStatus, updateUserTourStatus, checkUserByMobile };
