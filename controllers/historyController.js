const { Op } = require("sequelize");
const historyService = require("../services/historyService");
module.exports = {};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
module.exports.index = async (req, res) => {
  const { query } = req;
  console.log(query);

  const page = parseInt(query.page?.toString() ?? "0") || 1;
  const search = {},
    where = {};

  if (query.id && Number(query.id)) {
    search.id = Number(query.id);
    where.id = search.id;
  } else {
    where.id = { [Op.ne]: null };
  }

  if (query.type && query.type !== "All") {
    search.type = query.type;
    where.type = search.type.toString().toLowerCase();
  }

  if (query.content) {
    search.content = query.content;
    where.content = { [Op.like]: `%${search.content}%` };
  }

  if (query.response) {
    search.response = query.response;
    where.response = { [Op.like]: `%${search.response}%` };
  }

  if (query.sessionId) {
    search.sessionId = query.sessionId;
    where.sessionId = search.sessionId.toString();
  }

  const timeConstrains = [];
  if (query.timeFrom && new Date(query.timeFrom?.toString() ?? 0).getTime()) {
    search.timeFrom = new Date(query.timeFrom?.toString() ?? 0).toISOString();
    timeConstrains.push({ createdAt: { [Op.gte]: new Date(search.timeFrom) } });
  }

  if (query.timeTo && new Date(query.timeTo?.toString() ?? 0).getTime()) {
    search.timeTo = new Date(query.timeTo?.toString() ?? 0).toISOString();
    timeConstrains.push({ createdAt: { [Op.lte]: new Date(search.timeTo) } });
  }

  if (timeConstrains.length) {
    where[Op.and] = timeConstrains;
  }

  const limit = 50;
  const offset = (page - 1) * limit;

  console.dir({ where }, { depth: 5 });

  const historyItems = await historyService.getAll({
    where,
    limit,
    offset,
    order: [["id", "desc"]],
  });

  let currentPage = Number(page) || 1;
  if (currentPage < 1) currentPage = 1;

  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  const history = historyItems.map((item) => item.get());
  console.log(history);
  res.render("history", {
    title: "History",
    search,
    currentPage,
    nextPage,
    prevPage,
    history,
  });
};
