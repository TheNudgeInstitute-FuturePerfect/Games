const express = require("express");
const { findAllEra } = require("../controller/index");

const router = express.Router();
router.get("/all-eras", findAllEra);

exports.router = router;
