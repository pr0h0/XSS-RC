const { session } = require("../models");
const logService = require("./logService");

module.exports = {};

/**
 * @typedef {{
 * id: number,
 * name: string,
 * status: "Active" | "Closed",
 * description: string,
 * time: string,
 * ua: string,
 * ip: string,
 * scriptId: number,
 * sessionId: string,
 * }} session
 */

/**
 * @param {import('sequelize').FindOptions} options
 * @returns {Promise<Array<session>>}
 */
module.exports.getAll = async (options) => {
  return session.findAll(options);
};

/**
 *
 * @param {Partial<session>} data
 * @returns {Promise<session>}
 */
module.exports.create = async (data) => {
  return session.create(data);
};

/**
 * @param {string} sessionId
 * @returns {Promise<session | null>}
 */
module.exports.getOne = async (sessionId) => {
  return session.findOne({ where: { sessionId } });
};

/**
 *
 * @param {number} id
 * @param {Partial<session>} data
 * @returns {Promise<[number]>}
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

/**
 * @returns {Promise<void>}
 */
module.exports.closeAllSessions = async () => {
  try {
    const [count] = await session.update(
      { status: "Closed" },
      { where: { status: "Active" } }
    );
    if (count > 0) {
      logService.info("All sessions closed", count, "were active");
    } else {
      logService.debug("All sessions were closed on last server shutdown");
    }
  } catch (error) {
    logService.error("Error closing all sessions", error);
  }
};

/**
 * @param {import('sequelize').FindOptions} options
 * @returns {Promise<number>}
 */
module.exports.deleteSessions = async (options) => {
  return session.destroy(options);
};
