const authService = require("../services/authService");
module.exports = {};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
module.exports.getLogin = function (req, res) {
  res.render("login");
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
module.exports.postLogin = function (req, res) {
  const password = req.body.password;
  const remember = req.body.remember;

  const finalPassword = authService.getFinalPassword(password);
  const HASH = authService.getHash(finalPassword);

  res.cookie("auth", HASH, {
    maxAge: remember ? 1000 * 60 * 60 * 24 * 30 : 1000 * 60 * 60,
    httpOnly: true,
  });
  res.redirect("/");
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
module.exports.getLogout = function (req, res) {
  res.clearCookie("auth");
  res.status(301).redirect("/login");
};
