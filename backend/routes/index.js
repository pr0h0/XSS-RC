const fs = require("fs");
const logService = require("../services/logService");

/**
 * @param {string} dir
 * @returns Array<string>
 */
const getFilesInDir = (dir) => {
  return fs.readdirSync(dir);
};

const weights = {
  "indexRouter.js": 1000,
};

const routers = getFilesInDir(__dirname)
  .filter((file) => file !== "index.js")
  .sort((a, b) => (weights[a] ?? 10) - (weights[b] ?? 10))
  .map((file) => {
    logService.debug(`${file.replace(/\.js$/, "")} initializing`);
    return require(`./${file}`);
  });

module.exports = routers;
