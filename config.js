/*
 * Create and export config files
 *
 */

// Container for all the env
let enviornments = {};

// Staging (default) env
enviornments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: "staging",
};

// Production env
enviornments.production = {
  httpPort: 5000,
  httsPort: 5001,
  envName: "production",
};

// Detemine the environment
var currentEnv =
  typeof process.env.NODE_ENV == "string"
    ? process.env.NODE_ENV.toLocaleLowerCase()
    : "";

// Check that the current env is one of the env above, if not, default staging
let envToExport =
  typeof enviornments[currentEnv] == "object"
    ? enviornments[currentEnv]
    : enviornments.staging;

// Export module
module.exports = envToExport;
