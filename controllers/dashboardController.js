const scriptsService = require("../services/scriptsService");
const sessionsService = require("../services/sessionsService");
const historyService = require("../services/historyService");
module.exports = {};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
module.exports.index = async (req, res) => {
  const scriptsCount = await scriptsService.count();
  const sessionsCount = await sessionsService.count();
  const historyCount = await historyService.count("");
  const screenshotsCount = await historyService.count("screenshot");

  res.render("dashboard", {
    title: "Dashboard",
    scriptsCount,
    sessionsCount,
    historyCount,
    screenshotsCount,
  });
};
