const scriptsService = require("../services/scriptsService");
const sessionsService = require("../services/sessionsService");
module.exports = {};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
module.exports.index = async (req, res) => {
  const scriptsCount = await scriptsService.count();
  const sessionsCount = await sessionsService.count();
  const historyCount = 999;
  const screenshotsCount = 999;

  res.render("dashboard", {
    title: "Dashboard",
    scriptsCount,
    sessionsCount,
    historyCount,
    screenshotsCount,
  });
};
