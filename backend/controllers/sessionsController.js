const { Op } = require("sequelize");
const sessionsService = require("../services/sessionsService");
const historyService = require("../services/historyService");
module.exports = {};

/**
 * @params {import("express").Request} req
 * @params {import("express").Response} res
 */
module.exports.index = async (req, res) => {
  const search = req.query;
  const { page = 0 } = search;

  /** @type {*} */
  const where = {
    id: { [Op.ne]: null },
  };
  if (search.id && Number(search.id)) where.id = Number(search.id);
  if (search.sessionId)
    where.sessionId = { [Op.like]: `%${search.sessionId}%` };
  if (
    search.status &&
    ["active", "closed"].includes(search.status.toLowerCase())
  )
    where.status = search.status;
  if (search.name) where.name = { [Op.like]: `%${search.name}%` };
  if (search.description)
    where.description = { [Op.like]: `%${search.description}%` };
  if (search.scriptId && Number(search.scriptId))
    where.scriptId = Number(search.scriptId);

  const timeConstrains = [];

  if (search.timeFrom && new Date(search.timeFrom).getTime()) {
    timeConstrains.push({ createdAt: { [Op.gte]: new Date(search.timeFrom) } });
  }

  if (search.timeTo && new Date(search.timeTo).getTime()) {
    timeConstrains.push({ createdAt: { [Op.lte]: new Date(search.timeTo) } });
  }

  if (timeConstrains.length) {
    where[Op.and] = timeConstrains;
  }

  const limit = 50;
  const offset = ((Number(page) || 1) - 1) * limit;

  const sessions = await sessionsService.getAll({
    order: [["id", "desc"]],
    limit: 50,
    offset: offset < 0 ? 0 : offset,
    where,
  });

  let currentPage = Number(page) || 1;
  if (currentPage < 1) currentPage = 1;

  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  res.render("sessions", {
    title: "Sessions",
    sessions,
    currentPage,
    prevPage,
    nextPage,
    search,
  });
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
module.exports.deleteSessions = async (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    res.redirect("/sessions");
    return;
  }

  await sessionsService.deleteSessions({ where: { id: { [Op.in]: ids } } });

  res.redirect("/sessions");
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
module.exports.singleSession = async (req, res) => {
  const { id } = req.params;

  const sessions = await sessionsService.getAll({
    where: { [Op.or]: [{ id }, { sessionId: id }] },
  });
  if (!sessions || sessions.length === 0) {
    res.render("404", {
      title: "Session not found",
    });
    return;
  }

  const session = sessions[0];

  const historyItems = await historyService.getAll({
    where: { sessionId: session.sessionId },
    // no order by id desc because we add latest messages to the bottom of container
    // order: [["id", "desc"]],
  });

  res.render("singleSession", {
    title: `${session.id} - ${session.name} - Session`,
    session,
    messages: historyItems,
  });
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
module.exports.findNextOneOpen = async (req, res) => {
  const { id } = req.params;
  if (!id || !Number(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const exactSession = await sessionsService.getAll({
    where: { id: Number(id) },
  });
  if (!exactSession || exactSession.length === 0) {
    res.render("404", {
      title: "Session not found",
    });
    return;
  }

  const avaliableSession = await sessionsService.getAll({
    where: {
      status: "Active",
      sessionId: exactSession[0]?.sessionId,
    },
    order: [["id", "desc"]],
  });

  if (!avaliableSession || avaliableSession.length === 0) {
    res.redirect("/sessions");
    return;
  }

  res.redirect(`/sessions/${avaliableSession[0].id}`);
};

module.exports.api = {};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
module.exports.api.deleteSessions = async (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    res.status(400).json({ error: "Invalid ids" });
    return;
  }

  const count = await sessionsService.deleteSessions({
    where: { id: { [Op.in]: ids } },
  });

  res.json({ count });
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
module.exports.api.index = async (req, res) => {
  const query = req.query;
  const {
    page = 0,
    id,
    sessionId,
    status,
    name,
    description,
    timeFrom,
    timeTo,
    scriptId,
  } = query;

  /** @type {any} */
  const where = {};

  if (id) where.id = Number(id);
  if (sessionId) where.sessionId = { [Op.like]: `%${sessionId}%` };
  if (status && status?.toString().toLowerCase() !== "all")
    where.status = status.toString();
  if (name) where.name = { [Op.like]: `%${name}%` };
  if (description) where.description = { [Op.like]: `%${description}%` };
  if (scriptId) where.scriptId = Number(scriptId);
  const timeConstrains = [];
  if (timeFrom)
    timeConstrains.push({
      createdAt: { [Op.gte]: new Date(timeFrom.toString()) },
    });
  if (timeTo)
    timeConstrains.push({
      createdAt: { [Op.lte]: new Date(timeTo.toString()) },
    });
  if (timeConstrains.length) where[Op.and] = timeConstrains;

  const sessions = await sessionsService.getAll({
    where,
    order: [["id", "desc"]],
    limit: 50,
    offset: Number(page) < 0 ? 0 : Number(page) * 50,
  });

  const sessionIds = sessions.map((session) => session.sessionId);
  const history = await Promise.all(
    sessionIds.map((id) =>
      historyService.getAll({
        where: { sessionId: id },
        order: [["id", "desc"]],
        limit: 50,
      })
    )
  );

  res.json({
    sessions,
    history: history.flat(),
  });
};
