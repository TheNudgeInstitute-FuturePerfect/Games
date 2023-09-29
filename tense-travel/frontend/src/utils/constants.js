const userIds = {
  userId: "651681f5849ffc7fca78d394",
  sessionId: "74dca45e-5817-4ff3-995a-5cbe7021fe51",
};

const coins = {
  defaultStars: {
    stars: 3,
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

module.exports = { userIds, coins, gameOverModalConfig };
