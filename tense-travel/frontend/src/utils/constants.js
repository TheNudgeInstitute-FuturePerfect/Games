const userIds = {
  userId: "6523ba5e7708707fdec0c2f3",
  sessionId: "edb0b40a-05ed-4fbe-a9d8-8f08eeb9c069",
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

module.exports = { userIds, coins, gameOverModalConfig, tourGuideSteps };
