const { Sequelize } = require("sequelize");
const config = require("../config/config");

const { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST, DIALECT, DB_PORT } =
  config[process.env.NODE_ENV];

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DIALECT,
  port: DB_PORT,
  logging: process.env.NODE_ENV === "development" ? false : console.log,
});

try {
  sequelize.authenticate().then(
    (value) => {
      console.log("DB Connection has been established successfully.");
    },
    (reject) => {
      console.log("DB Unable to connect to db (rejected) :: ", reject);
    }
  );
} catch (error) {
  console.log("DB Unable to connect to db => ", error.message);
}
module.exports = sequelize;
