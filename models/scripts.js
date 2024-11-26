"use strict";
const { Model } = require("sequelize");

/**
 *
 * @param {*} sequelize
 * @param {*} DataTypes
 * @returns {typeof Model}
 */
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
    },
  );
  return scripts;
};
