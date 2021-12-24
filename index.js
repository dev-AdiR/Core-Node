/*
 * Primary file for API
 *
 */

// Dependencies
const http = require("http");
const https = require("https");
const url = require("url");
const stringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
const fs = require("fs");
// Instantiating a HTTP server
const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});

// Start the HTTP server
httpServer.listen(config.httpPort, () => {
  console.log("Listening on HTTP port", config.httpPort);
});

// Instantiating a HTTPS server
let httpsServerOptions = {
  key: fs.readFileSync("./https/key.pem"),
  cert: fs.readFileSync("./https/cert.pem"),
};

const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res);
});

// Start the HTTPS server
httpsServer.listen(config.httspPort, () => {
  console.log("Listening on HTTPs port", config.httpsPort);
});

// All the server logic for both http and https server
let unifiedServer = (req, res) => {
  // Get the URL and parse it
  const parsedUrl = url.parse(req.url, true);

  // Get the path
  const path = parsedUrl.pathname;
  let trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Get query string as object
  let queryStringObject = parsedUrl.query;

  // Get the HTTP method
  let method = req.method.toLocaleLowerCase();

  // Get headers
  let headers = req.headers;

  // Get the payload, if any
  const decoder = new stringDecoder("utf-8");
  let buffer = "";
  let oldBuffer = buffer;
  req.on("data", (data) => {
    buffer += decoder.write(data);
  });
  req.on("end", () => {
    buffer += decoder.end();

    // Choose the handler this request should go to
    let chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    // Construct data obj to send to handler
    var data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: buffer,
    };
    // Route the request to the handler
    chosenHandler(data, (statusCode, payload) => {
      statusCode = typeof statusCode == "number" ? statusCode : 200;

      payload = typeof payload == "object" ? payload : {};

      // Convert payload to string
      let payloadString = JSON.stringify(payload);

      // Return response
      res
        .setHeader("Content-Type", "Application/json")
        .writeHead(statusCode)
        .end(payloadString);

      // Log the request path
      // console.log("Returning this response: ", statusCode, payloadString);
    });
  });
};

const a = { foo: "bar" };
console.log(`sss ${a}`);
console.log("sss", a);
// Define handlers
let handlers = {};

// Ping handler
handlers.ping = (data, callback) => {
  callback(200);
};

// Define not found
handlers.notFound = (data, callback) => {
  callback(404);
};

// Define a request router
let router = {
  ping: handlers.ping,
};
