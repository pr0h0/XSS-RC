const logService = require("./logService");

process.on("unhandledRejection", (error) => {
  logService.error(`Unhandled Rejection: ${error.message}`);
  logService.error(error.stack);
});

process.on("uncaughtException", (error) => {
  logService.error(`Uncaught Exception: ${error.message}`);
  logService.error(error.stack);
});
