const express = require("express");
const { getTourStatus, updateTourStatus } = require("../controller");
const {
  userTourGuideValidator,
} = require("../modules/validators/userValidator");

const router = express.Router();
router.get("/user-tour-status/:userId", getTourStatus);
router.patch(
  "/update-user-tour-status/:userId",
  [userTourGuideValidator],
  updateTourStatus
);

exports.router = router;
