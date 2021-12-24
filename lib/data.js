/*
 * Library for storing and editing data
 *
 */

const fs = require("fs");
const path = require("path");

// Container for the module
let lib = {};

// Base dir of the data folder
lib.baseDir = path.join(__dirname, "/../.data/");

// Write data to file
lib.create = (dir, file, data, callback) => {
  // Open file for writing
  fs.open(
    lib.baseDir + dir + "/" + file + ".json",
    "wx",
    (err, fileDescriptor) => {
      if (!err & fileDescriptor) {
        // Convert data to string
        let stringData = JSON.stringify(data);

        // Write to file and close it
        fs.writeFile(fileDescriptor, stringData, (err) => {
          if (!err) {
            // Close the file
            fs.close(fileDescriptor, (err) => {
              if (!err) {
                callback(false);
              } else {
                callback("Error closing new file");
              }
            });
          } else {
            callback("Error writing to new file");
          }
        });
      } else {
        callback("Could not create new file, it may already exist");
      }
    }
  );
};

// Export the container
module.exports = lib;
