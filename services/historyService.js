const { Op } = require("sequelize");
const { history } = require("../models");
module.exports = {};

/**
 * @typedef {{
 * id: number,
 * type:string,
 * sessionId:string,
 * content: string,
 * response: string,
 * createdAt?: string,
 * updatedAt?: string
 * }} history
 */

/**
 * @param {Partial<history>} data
 * @returns {Promise<history>}
 */
module.exports.create = async (data) => {
  return history.create(data);
};

/**
 * @param {import('sequelize').FindOptions} options
 * @returns {Promise<history[]>}
 */
module.exports.getAll = async (options) => {
  return history.findAll(options);
};

/**
 * @param {string} sessionId
 * @param {Partial<history>} data
 * @returns {Promise<[number]>}
 */
module.exports.update = async (sessionId, data) => {
  return history.update(data, { where: { sessionId } });
};

/**
 * @param {number} id
 * @returns {Promise<history | null>}
 */
module.exports.getOne = async (id) => {
  return history.findOne({ where: { id } });
};

/**
 * @param {string} type
 * @returns {Promise<number>} count
 */
module.exports.count = async (type) => {
  const where = {
    id: { [Op.ne]: null },
  };
  if (type) where.type = type;
  return history.count({ where });
};
