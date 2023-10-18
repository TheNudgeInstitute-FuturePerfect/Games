const express = require("express");
const { getTourStatus } = require("../controller");

const router = express.Router();
router.get("/user-tour-status/:userId", getTourStatus);

exports.router = router;
