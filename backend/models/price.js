const { DataTypes } = require('sequelize');
const sequelize = require("../config/db");
const Currency = require('./currency');

const Price = sequelize.define('price', {
  value: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  currencyId: { 
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Currency,
      key: 'symbol'
    }
  }
},{
    paranoid: true,
  },);

const sync = Price.sync();

sync.then(async (value) => {
  console.log(value);
});
module.exports = Price;
