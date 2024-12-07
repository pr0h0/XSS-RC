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
