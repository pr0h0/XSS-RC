"use strict";

const Sequelize = require("sequelize");
const process = require("process");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

const db = {
  history: require("./history")(sequelize, Sequelize.DataTypes),
  scripts: require("./scripts")(sequelize, Sequelize.DataTypes),
  session: require("./session")(sequelize, Sequelize.DataTypes),
  sequelize,
  Sequelize,
};

Object.keys(db)
  .filter((key) => key.toLowerCase() !== "sequelize")
  .forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

module.exports = db;
