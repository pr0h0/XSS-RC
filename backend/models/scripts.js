"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class scripts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      scripts.hasMany(models.session, {
        foreignKey: "scriptId",
      });
    }
  }

  scripts.init(
    {
      name: DataTypes.STRING,
      site: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "scripts",
    }
  );

  module.exports.model = scripts;

  return scripts;
};
