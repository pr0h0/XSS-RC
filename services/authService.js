const crypto = require("crypto");

module.exports = {};

const serverStartTime = Math.round(Date.now() * Math.random());
const randJoinChar =
  "1234567890ABCDEFGHIJKLMNOPQRSTUWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+=-{}[]:;\"'|\\<,>.?/"
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("")[0];

/**
 * @returns {string} password
 */
module.exports.getPassword = () => process.env.AUTH_PASSWORD;

/**
 * @returns {string} salt
 */
module.exports.getSalt = () => process.env.AUTH_SALT;

/**
 * @param {string} password
 * @returns {string} final password with salt
 */
module.exports.getFinalPassword = (password) => {
  const salt = module.exports.getSalt();
  let finalPassword = "";
  if (salt.indexOf("{PASSWORD}") > -1) {
    finalPassword = salt.replaceAll("{PASSWORD}", password);
  } else {
    finalPassword = [salt, password, serverStartTime, password, salt].join(
      randJoinChar,
    );
  }
  return finalPassword;
};

/**
 * @param {string} password
 * @returns {string} SHA256 hash of the password
 */
module.exports.getHash = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex") ?? "";
};

/**
 * @type {string}
 */
let envPasswordHash = null;

/**
 * @returns {string} SHA256 hash of the password from the environment
 */
module.exports.getEnvPasswordHash = () => {
  if (envPasswordHash === null) {
    envPasswordHash = module.exports.getHash(
      module.exports.getFinalPassword(module.exports.getPassword()),
    );
  }
  return envPasswordHash;
};
