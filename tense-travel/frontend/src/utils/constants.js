import { getStorage } from "./manageStorage";

const userIds = {
  // userId: "6512d743574d4522062e3f87",
  // userId: getStorage()["userId"],
  // mobile: getStorage()["mobile"],
  // sessionId: getStorage()["sessionId"],
  userId: "",
  mobile: "",
  sessionId: "",
};

const userInfo = () => {
  const userDetail = getStorage();
  userIds.userId = userDetail?.userId;
  userIds.mobile = userDetail?.mobile;
  userIds.sessionId = userDetail?.sessionId;
  return userDetail;
};

const coins = {
  defaultStars: {
    stars: 3,
  },
  purchaseLives: {
    coins: 10,
  },
};

const gameOverModalConfig = {
  POPUP_TYPES: {
    PURCHASE_POPUP: "gameOverMainScreen",
    PURCHASE_LIVES_POPUP: "gameOverBuyLives",
    RETRY_GAME_POPUP: "gameOverFinalScreen",
  },
  PURCHASE_TYPES: {
    PURCHASE_LIVES: "gameOverBuyLives",
  },
  UNDEFINED: "null",
};

const tourGuideSteps = {
  steps: 1,
  show: false,
  completed: false,
};

const setTimeOutFn = {
  status: false,
};

export {
  userIds,
  coins,
  gameOverModalConfig,
  tourGuideSteps,
  setTimeOutFn,
  userInfo,
};
