const scriptService = require("../services/scriptsService");

module.exports = {};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
module.exports.index = async (req, res) => {
  const query = req.query;
  const id = req.params.id;

  if (!id || Number.isNaN(Number(id))) {
    return res.render("400", {
      title: "400 Bad Request",
      message: "Invalid ID",
    });
  }

  const script = await scriptService.getScript(id);

  if (!script) {
    return res.render("404", {
      title: "404 Not Found",
      message: "Script not found",
    });
  }

  res.render("example", {
    title: `Example ${id}`,
    script: { ...script.get(), createdAt: undefined, updatedAt: undefined },
    query: query,
  });
};
