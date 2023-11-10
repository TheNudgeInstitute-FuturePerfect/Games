import { gameOverModalConfig, setTimeOutFn } from "./constants";

// const popupTypes = [
//   "purchasePopup",
//   "purchaseLivesPopup",
//   "purchaseLives",
//   "gameOverFinalScreen",
// ];
const popupTypes = [
  "PURCHASE_POPUP",
  "PURCHASE_LIVES_POPUP",
  "PURCHASE_LIVES",
  "RETRY_GAME_POPUP",
  "QUESTION_EXPLANATION_POPUP",
];

const actions = ["PURCHASE_LIVES"];

const actionType = (action) => {
  if (popupTypes.includes(action)) {
    action = action.toUpperCase();
    if (gameOverModalConfig.POPUP_TYPES.hasOwnProperty(action)) {
      return gameOverModalConfig.POPUP_TYPES[action];
    } else if (gameOverModalConfig.PURCHASE_TYPES.hasOwnProperty(action)) {
      return gameOverModalConfig.PURCHASE_TYPES[action];
    } else {
      return gameOverModalConfig.UNDEFINED;
    }
  }
};

const setTimeOut = (time, navigate, url) => {
  const timeOut = setTimeout(() => {
    navigate(url);
  }, time);
  clearTimeout(timeOut);
};

export { actionType, popupTypes, actions, setTimeOut };
