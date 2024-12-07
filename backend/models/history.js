"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      history.belongsTo(models.session, {
        foreignKey: "sessionId",
        as: "session",
      });
    }
  }
  history.init(
    {
      type: DataTypes.STRING,
      sessionId: DataTypes.STRING,
      content: DataTypes.TEXT,
      response: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "history",
    }
  );

  module.exports.model = history;
  return history;
};
