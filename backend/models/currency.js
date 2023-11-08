const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Currency = sequelize.define(
  "currency",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    binanceSymbol: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    paranoid: true,
  }
);

const sync = Currency.sync();

sync.then(async (value) => {
  console.log(value);
});

module.exports = Currency;
