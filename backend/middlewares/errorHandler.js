const logService = require("../services/logService");

/**
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
module.exports = (err, req, res, next) => {
  logService.error(err);
  res.status(500);
  if (req.path.startsWith("/api")) {
    res.json({ error: "Internal server error", message: err.message }).end();
  } else {
    res.send("Internal server error").send(err.message).end();
  }
};
