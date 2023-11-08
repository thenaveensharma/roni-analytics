const sequelize = require("../config/db");
const { Op } = require("sequelize");
const Price = require("../models/price");

const getHistoricalData = async (req, res) => {
  try {
    const symbol = req.params.symbol;
    const { from, to } = req.query;

    // Check if 'symbol', 'from', and 'to' parameters are present in the request
    if (!symbol || !from || !to) {
      return res.status(400).json({
        message: "Missing required parameters (symbol, from, or to)",
      });
    }

    // Convert 'from' and 'to' parameters to Date objects
    const fromDate = new Date(parseInt(from));
    const toDate = new Date(parseInt(to));

    // Calculate the number of days between 'fromDate' and 'toDate'
    const days = getNumberOfDays(fromDate, toDate);

    // Set expression based on the number of days
    let expression;
    switch (true) {
      case days === 1:
        expression = "%Y-%m-%d %H:%i";
        break;
      case days > 1 && days <= 30:
        expression = "%Y-%m-%d";
        break;
      case days > 30:
        expression = "%x-%v";
        break;
      default:
        expression = "%Y-%m-%d %H:%i";
        break;
    }

    // Query for maximum prices within the specified time range
    const maxQuery = Price.findAll({
      attributes: [
        [sequelize.fn("MAX", sequelize.col("value")), "price"],
        [
          sequelize.literal(`DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i')`),
          "timestamp",
        ],
      ],
      where: {
        timestamp: {
          [Op.gte]: fromDate,
          [Op.lt]: toDate,
        },
        currencyId: symbol,
      },
      group: [sequelize.literal(`DATE_FORMAT(timestamp, '${expression}')`)],
      raw: true,
    });

    // Query for minimum prices within the specified time range
    const minQuery = Price.findAll({
      attributes: [
        [sequelize.fn("MIN", sequelize.col("value")), "price"],
        [
          sequelize.literal(`DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i')`),
          "timestamp",
        ],
      ],
      where: {
        timestamp: {
          [Op.gte]: fromDate,
          [Op.lt]: toDate,
        },
        currencyId: symbol,
      },
      group: [sequelize.literal(`DATE_FORMAT(timestamp, '${expression}')`)],
      raw: true,
    });

    // Execute both queries concurrently using Promise.all
    Promise.all([maxQuery, minQuery])
      .then((results) => {
        const maxPrices = results[0];
        const minPrices = results[1];

        // Combine max and min prices into a single array
        const combinedResults = maxPrices.concat(minPrices);

        // Sort combinedResults by timestamp
        combinedResults.sort((a, b) => {
          const timestampA = new Date(a.timestamp);
          const timestampB = new Date(b.timestamp);
          return timestampA - timestampB;
        });

        // Send the combined results as JSON response
        return res.json({
          message: "Data fetched successfully",
          data: combinedResults,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } catch (error) {
    console.log("Something went wrong while fetching prices : ", error);

    // Send an error response to the client
    res.status(400).json({
      message: "Something went wrong while fetching prices",
    });
  }
};

// Function to calculate the number of days between two dates
function getNumberOfDays(startDate, endDate) {
  try {
    // Convert both dates to UTC
    const startUTC = Date.UTC(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );
    const endUTC = Date.UTC(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate()
    );

    // Calculate the difference in milliseconds
    const diff = endUTC - startUTC;

    // Convert the difference to days
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = { getHistoricalData };
