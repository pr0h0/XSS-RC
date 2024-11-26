const crypto = require("crypto");
const authService = require("../services/authService");

module.exports = function (required) {
  return function (req, res, next) {
    // pull cookie 'auth' form the request
    const auth = req.cookies.auth;

    // if the cookie is not set, redirect to login
    if (!auth && required) {
      return res.redirect("/login");
    } else if (!auth) {
      return next();
    }

    const a = Buffer.from(auth);
    const b = Buffer.from(authService.getEnvPasswordHash());

    res.locals.auth = a.length === b.length && crypto.timingSafeEqual(a, b);

    // if the cookie is set, check if it's SHA256 hash is equal to the one we have stored
    if (required && !res.locals.auth) {
      return res.redirect("/login");
    }

    // if everything is OK, proceed to the next middleware
    next();
  };
};
