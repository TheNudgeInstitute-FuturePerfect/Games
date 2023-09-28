const userIds = {
  userId: "6512d73d574d4522062e3f84",
  sessionId: "7694ffb1-09c8-48da-b7d1-819c79c4891c",
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
