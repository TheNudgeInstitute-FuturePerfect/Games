const express = require("express");
const {
  getEraAnswerAllHistory,
  getEraAnswerHistoryByUserId,
} = require("../controller/index");

const router = express.Router();
router.get("/get-era-answer-all-history", getEraAnswerAllHistory);
router.get(
  "/get-era-answer-history-by-userid/:userId",
  getEraAnswerHistoryByUserId
);

exports.router = router;
