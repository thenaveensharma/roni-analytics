const dotenv = require("dotenv");
const path = require("path");
const { Sequelize } = require("sequelize");
dotenv.config({ path: path.join(__dirname, "../", ".env") });
const config = {
  [process.env.NODE_ENV]: {
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    DB_HOST: process.env.DB_HOST,
    DIALECT: process.env.DIALECT,
    DB_PORT: process.env.DB_PORT,
    PORT: process.env.PORT,
  },
};

module.exports = config;
