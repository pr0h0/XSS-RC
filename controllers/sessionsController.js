const sessionsService = require("../services/sessionsService");
module.exports = {};

/**
 * @params {import("express").Request} req
 * @params {import("express").Response} res
 */
module.exports.index = async (req, res) => {
  const sessions = await sessionsService.getAll({
    order: [["id", "desc"]],
    limit: 50,
  });

  res.render("sessions", {
    title: "Sessions",
    sessions,
  });
};
