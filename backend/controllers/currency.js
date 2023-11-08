const currencies = require("../data/data");
const Currency = require("../models/currency");

const createCurrencies = async (req, res) => {
  try {
    const result = [];
    for (let index = 0; index < currencies.length; index++) {
      const currency = await Currency.create(currencies[index]);
      result.push(currency);
    }
    return res.json({
      message: "Currencies created successfully",
      data: result,
    });
  } catch (error) {
    console.log("Something went wrong while creating currencies: ", error);
    res.status(400).json({
      message: "Something went wrong while creating currencies",
    });
  }
};
module.exports = { createCurrencies };
