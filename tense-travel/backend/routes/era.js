const express = require("express");
const { findAllEra, getAllEraItsPercentage } = require("../controller/index");

const router = express.Router();
router.get("/all-eras", findAllEra);
router.post("/all-era-its-percentage", getAllEraItsPercentage);

exports.router = router;
