const express = require("express");
const { getHistoricalData } = require("../controllers/price");
const router = express.Router();

router.get("/:symbol/history", getHistoricalData);

module.exports = router;
