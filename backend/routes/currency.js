const express = require("express");
const { createCurrencies } = require("../controllers/currency.js");
const router = express.Router();

router.get("/create", createCurrencies);
module.exports = router;
