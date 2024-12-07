const logService = require("./logService");

process.on("unhandledRejection", (/** @type {Error} */ error) => {
  logService.error(`Unhandled Rejection: ${error.message}`);
  logService.error(error.stack);
});

process.on("uncaughtException", (/** @type {Error} */ error) => {
  logService.error(`Uncaught Exception: ${error.message}`);
  logService.error(error.stack);
});
