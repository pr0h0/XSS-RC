const io = require("socket.io");
const logService = require("./services/logService");
const sessionsService = require("./services/sessionsService");

module.exports = (httpServer) => {
  logService.info("Socket.io server initialized");
  logService.info(new Array(40).join("="));
  io(httpServer).on("connection", (socket) => {
    const state = {};
    logService.log("User connected");

    socket.on("disconnect", () => {
      logService.log("User disconnected", state);

      if (state.id) {
        sessionsService.update(state.id, { status: "Closed" });
      }
    });

    socket.on("join", ({ scriptId, sessionId }) => {
      if (!sessionId || sessionId === "new") {
        const newSessionId = Math.random().toString(36).slice(2);
        socket.join(newSessionId);
        logService.log(`User created session ${newSessionId}`);
        socket.emit("session", { sessionId: newSessionId });
        state.sessionId = newSessionId;
      } else {
        socket.join(sessionId);
        logService.log(`User joined session ${sessionId}`);
        state.sessionId = sessionId;
      }

      sessionsService
        .create({
          name: "New session",
          status: "Active",
          description: "",
          time: new Date().toISOString(),
          ua: socket.handshake.headers["user-agent"],
          ip: socket.handshake.address,
          scriptId,
          sessionId: state.sessionId,
        })
        .then((session) => {
          state.id = session.id;
        });
    });
  });
};
