/*
 * Helpers for various tasks
 *
 */

// Dependencies
const crypto = require("crypto");
const config = require("../config");

// Container for all helpers
let helpers = {};

// Create a Sha256 hash
helpers.hash = (str) => {
  if (typeof str == "string" && str.trim().length > 0) {
    let hash = crypto
      .createHmac("sha256", config.hashingSecret)
      .update(str)
      .digest("hex");
    return hash;
  } else {
    return false;
  }
};

// Parse JSON string to object
helpers.parseJsonToObject = (str) => {
  try {
    let obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
};

// Export the helpers
module.exports = helpers;
