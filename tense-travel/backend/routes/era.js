const express = require("express");
const {
  findAllEra,
  getAllEraItsPercentage,
  resetUserRecentStage,
} = require("../controller/index");
const {
  userRecentStageCompletedValidator,
} = require("../modules/validators/tenseEraValidator");

const router = express.Router();
router.get("/all-eras", findAllEra);
router.post("/all-era-its-percentage", getAllEraItsPercentage);
router.post(
  "/reset-user-recent-stage",
  [userRecentStageCompletedValidator],
  resetUserRecentStage
);
exports.router = router;
