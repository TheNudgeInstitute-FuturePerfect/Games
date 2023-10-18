const userIds = {
  userId: "6512d743574d4522062e3f87",
  sessionId: "b00aadcb-0d22-4707-910e-e8826d591330",
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
};

const setTimeOutFn = {
  status: false,
};

module.exports = {
  userIds,
  coins,
  gameOverModalConfig,
  tourGuideSteps,
  setTimeOutFn,
};
