require("dotenv").config();

// handle unhandled rejections
require("../services/unhandledRejectionHandler");

const app = require("../app");

const port = process.env.PORT || 3000;

const http = require("http");
const logService = require("../services/logService");

// create http server
const server = http.createServer(app);

// init socket.io server
require("../socket")(server);

// start server
server.listen(port, () => {
  logService.log(`Server is running on port ${port}`);
});

// error handling
server.on("error", (error) => {
  logService.error(`Error: ${error}`);
});

module.exports = server;
