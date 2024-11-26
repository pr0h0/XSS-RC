const { scripts } = require("../models");

module.exports = {};

/**
 * @param {{name:string, site: string}} script
 * @returns {Promise<import('../models').scripts>}
 */
module.exports.newScript = function ({ name, site }) {
  if (!name || !site) {
    return Promise.reject(new Error("Name and site are required"));
  }
  return scripts.create({ name, site });
};

/**
 * @returns {Promise<import('../models').scripts[]>}
 */
module.exports.getAllScripts = function () {
  return scripts.findAll({ order: [["createdAt", "DESC"]] });
};

/**
 * @param {number} id
 * @returns {Promise<number>}
 */
module.exports.deleteScript = function (id) {
  return scripts.destroy({ where: { id } });
};

/**
 * @returns {Promise<number>}
 */
module.exports.count = function () {
  return scripts.count();
};

/**
 * @param {number} id
 * @returns {Promise<import('../models').scripts>}
 */
module.exports.getScript = function (id) {
  return scripts.findOne({ where: { id } });
};
