const logService = require("../services/logService");
const scriptsService = require("../services/scriptsService");
const sessionsService = require("../services/sessionsService");
module.exports = {};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
module.exports.index = async (req, res) => {
  try {
    const scripts = await scriptsService.getAllScripts();

    res.render("scripts", {
      title: "Scripts",
      scripts,
    });
  } catch (e) {
    logService.error(e.message);
    logService.error(e.stack);
    res.render("400", {
      title: "Bad Request",
      message: e.message ?? "Error getting scripts",
    });
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
module.exports.postNew = async (req, res) => {
  const name = req.body.name;
  const site = req.body.site;

  try {
    const script = await scriptsService.newScript({ name, site });
    if (!script) {
      throw new Error("Error creating script");
    }
  } catch (e) {
    logService.error(e.message);
    logService.error(e.stack);

    res.render("400", {
      title: "Bad Request",
      message: e.message ?? "Error creating script",
    });
    return;
  }

  res.redirect("/scripts");
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
module.exports.deleteScript = async (req, res) => {
  const id = req.params.id;

  try {
    const script = await scriptsService.deleteScript(Number(id));
    if (!script) {
      throw new Error("Error deleting script");
    }

    await sessionsService.deleteSessions({ where: { scriptId: Number(id) } });
  } catch (e) {
    logService.error(e.message);
    logService.error(e.stack);

    res.render("400", {
      title: "Bad Request",
      message: e.message ?? "Error deleting script",
    });
    return;
  }

  res.redirect("/scripts");
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
module.exports.getRawScript = async (req, res) => {
  const id = req.params.id;

  try {
    const script = await scriptsService.getScript(Number(id));
    if (!script) {
      throw new Error("Error getting script");
    }

    res.header("Content-Type", "text/javascript");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.render("script", {
      title: script.name,
      script,
    });
  } catch (e) {
    logService.error(e.message);
    logService.error(e.stack);

    res.render("400", {
      title: "Bad Request",
      message: e.message ?? "Error getting script",
    });
  }
};
