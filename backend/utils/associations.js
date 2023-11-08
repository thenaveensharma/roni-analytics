const Currency = require("../models/currency");
const Price = require("../models/price");

Currency.hasMany(Price, { foreignKey: "currencyId" });
Price.belongsTo(Currency, { foreignKey: "currencyId" });
