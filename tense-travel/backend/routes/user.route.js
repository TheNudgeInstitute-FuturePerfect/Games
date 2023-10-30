const express = require("express");
const {
  getTourStatus,
  updateTourStatus,
  shareGameSessionDetail,
} = require("../controller");
const {
  userTourGuideValidator,
  shareGameSessionDetailValidator,
} = require("../modules/validators/userValidator");

const router = express.Router();
router.get("/user-tour-status/:userId", getTourStatus);
router.patch(
  "/update-user-tour-status/:userId",
  [userTourGuideValidator],
  updateTourStatus
);
router.patch(
  "/share-game-session-detail/:mobileNumber",
  [shareGameSessionDetailValidator],
  shareGameSessionDetail
);
exports.router = router;
