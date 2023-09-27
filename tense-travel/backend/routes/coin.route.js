const express = require("express");
const { getUserCoins, buyLives } = require("../controller/index");
const {
  buyLivesValidator,
} = require("../modules/validators/buyLivesValidator");

const router = express.Router();
router.get("/get-user-coins/:userId", getUserCoins);
router.post("/buy-stage-lives", [buyLivesValidator], buyLives);

exports.router = router;
