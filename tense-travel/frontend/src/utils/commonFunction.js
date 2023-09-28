import { gameOverModalConfig } from "./constants";

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

export { actionType, popupTypes, actions };
