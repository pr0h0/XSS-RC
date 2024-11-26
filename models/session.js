"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      session.belongsTo(models.scripts, {
        foreignKey: "scriptId",
      });
    }
  }
  session.init(
    {
      name: DataTypes.STRING,
      status: DataTypes.INTEGER,
      description: DataTypes.STRING,
      time: DataTypes.STRING,
      ua: DataTypes.STRING,
      ip: DataTypes.STRING,
      scriptId: DataTypes.INTEGER,
      sessionId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "session",
    },
  );
  return session;
};
