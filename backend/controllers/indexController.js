const scriptsService = require("../services/scriptsService");
const sessionsService = require("../services/sessionsService");
const historyService = require("../services/historyService");
module.exports = {};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
module.exports.index = (req, res) => {
  res.render("index", { title: "Home" });
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
module.exports["404"] = (req, res) => {
  res.render("404", { title: "Page Not Found" });
};

module.exports.api = {};

module.exports.api.initialData = async (req, res) => {
  const [
    scripts,
    sessions,
    history,
    scriptsCount,
    sessionsCount,
    historyCount,
    screenshotsCount,
  ] = (
    await Promise.allSettled([
      scriptsService.getAllScripts(),
      sessionsService.getAll({
        limit: 50,
        order: [["id", "desc"]],
      }),
      historyService.getAll({
        limit: 200,
        order: [["id", "desc"]],
      }),
      scriptsService.count(),
      sessionsService.count(),
      historyService.count(""),
      historyService.count("screenshot"),
    ])
  ).map((result, ix) =>
    result.status === "fulfilled" ? result.value : ix < 3 ? [] : 0
  );

  res.json({
    scripts,
    sessions,
    history,
    scriptsCount,
    sessionsCount,
    historyCount,
    screenshotsCount,
  });
};
