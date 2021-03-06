// Dependencies
const _data = require("./data");
const helpers = require("./helpers");
let handlers = {};

handlers.users = (data, callback) => {
  let acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for user submethods
handlers._users = {
  // Required fields: firstName, lastName, phone, password, tosAgreement,
  // Optional fields: None
  post: (data, callback) => {
    // Check that all required fields are filled out
    let firstName =
      typeof data.payload.firstName == "string" &&
      data.payload.firstName.trim().length > 0
        ? data.payload.firstName.trim()
        : false;
    let lastName =
      typeof data.payload.lastName == "string" &&
      data.payload.lastName.trim().length > 0
        ? data.payload.lastName.trim()
        : false;
    let phone =
      typeof data.payload.phone == "string" &&
      data.payload.phone.trim().length == 10
        ? data.payload.phone.trim()
        : false;
    let password =
      typeof data.payload.password == "string" &&
      data.payload.password.trim().length > 0
        ? data.payload.password.trim()
        : false;
    let tosAgreement =
      typeof data.payload.tosAgreement == "boolean" &&
      data.payload.tosAgreement == true
        ? true
        : false;

    if (firstName && lastName && phone && password && tosAgreement) {
      // Make sure that the user doesn't exist
      _data.read("users", phone, (err, data) => {
        if (err) {
          // Hash the password
          let hashedPassword = helpers.hash(password);

          if (hashedPassword) {
            // Create the user object
            let userObject = {
              firstName,
              lastName,
              tosAgreement,
              phone,
              hashedPassword,
            };

            // Store the user
            _data.create("users", phone, userObject, (err) => {
              if (!err) {
                callback(200);
              } else {
                console.log(err);
                callback(500, { Error: "Could not create new user" });
              }
            });
          } else {
            callback(500, { Error: "Could not has the user's password" });
          }
        } else {
          // User already exist
          callback(400, { Error: "User already exist" });
        }
      });
    } else {
      callback(400, { Error: "Missing required fields" });
    }
  },

  // Required Fields: Phone,
  // Optional data: None
  // @TODO Only let an authenticated user acccess their object, don't let them access anyone else's
  get: (data, callback) => {
    // Check that the phone number provided is valid
    let phone =
      typeof data.queryStringObject.phone == "string" &&
      data.queryStringObject.phone.trim().length == 10
        ? data.queryStringObject.phone.trim()
        : false;

    if (phone) {
      // Lookup the user
      _data.read("users", phone, (err, data) => {
        if (!err && data) {
          // Remove the hashed password from the user object before returning it
          delete data.hashedPassword;
          callback(200, data);
        } else {
          callback(404);
        }
      });
    } else {
      callback(400, { Error: "Missing required field" });
    }
  },

  // Required data: Phone
  // Optional data: firstName, lastName, password (at least one must be specified)
  // @TODO Only let an authenticated user update their own object
  put: (data, callback) => {
    // Check for the required fields
    let phone =
      typeof data.payload.phone == "string" &&
      data.payload.phone.trim().length == 10
        ? data.payload.phone.trim()
        : false;

    // Check for optional fields
    let firstName =
      typeof data.payload.firstName == "string" &&
      data.payload.firstName.trim().length > 0
        ? data.payload.firstName.trim()
        : false;
    let lastName =
      typeof data.payload.lastName == "string" &&
      data.payload.lastName.trim().length > 0
        ? data.payload.lastName.trim()
        : false;
    let password =
      typeof data.payload.password == "string" &&
      data.payload.password.trim().length > 0
        ? data.payload.password.trim()
        : false;

    // Error if the phone is invalid
    if (phone) {
      // Error if nothing is sent to update
      if (firstName || lastName || password) {
        // Lookup user
        _data.read("users", phone, (err, userData) => {
          if (!err && userData) {
            // Update the necessary fields
            if (firstName) {
              userData.firstName = firstName;
            } else if (lastName) {
              userData.lastName = lastName;
            } else if (password) {
              userData.hashedPassword = helpers.hashedPassword(password);
            }
            // Store the new updates
            _data.update("users", phone, userData, (err) => {
              if (!err) {
                callback(200, {});
              } else {
                console.log(err);
                callback(500, { Error: "Could not update the user" });
              }
            });
          } else {
            callback(404, "User doesn't exist");
          }
        });
      } else {
        callback(400, { Error: "Missing fields to update" });
      }
    } else {
      callback(400, { Error: "Missing required field" });
    }
  },

  delete: (data, callback) => {
    // Check that the phone numberis valid
    let phone =
      typeof data.queryStringObject.phone == "string" &&
      data.queryStringObject.phone.trim().length == 10
        ? data.queryStringObject.phone.trim()
        : false;

    if (phone) {
      // Lookup the user
      _data.read("users", phone, (err, data) => {
        if (!err && data) {
          _data.delete("users", phone, (err) => {
            if (!err) {
              callback(200);
            } else {
              callback(500, { Error: "Could not delete the user" });
            }
          });
        } else {
          callback(400, { Error: "Could not find the user" });
        }
      });
    } else {
      callback(400, { Error: "Missing required field" });
    }
  },
};

module.exports = handlers;
