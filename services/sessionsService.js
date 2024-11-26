const { session } = require("../models");

module.exports = {};

/**
 *
 * @param {import('sequelize').FindOptions} options
 * @returns
 */
module.exports.getAll = async (options) => {
  return session.findAll(options);
};

/**
 * @typedef {{
 * name: string,
 * status: "Active" | "Closed",
 * description: string,
 * time: string,
 * ua: string,
 * ip: string,
 * scriptId: number,
 * sessionId: string,
 * }} Session
 */

/**
 *
 * @param {Session} data
 * @returns {Promise<import("sequelize").Model<Session>>}
 */
module.exports.create = async (data) => {
  return session.create(data);
};

/**
 *
 * @param {number} id
 * @param {Session} data
 * @returns
 */
module.exports.update = async (id, data) => {
  return session.update(data, { where: { id } });
};

/**
 * @returns {Promise<number>}
 */
module.exports.count = () => {
  return session.count();
};
