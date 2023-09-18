const { connectToDb } = require("./configs/dbConnection");
require("dotenv").config();
const { routeConfig } = require("./configs/router");
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const corsOptions = require("./configs/corsOptions.json");
const morganMiddleware = require("./utils/httpLogger");
const logger = require("./utils/logger");
const errorHandler = require("./modules/errorHandler/errorHandler");

const app = express();
app.use(morganMiddleware);

const cors = require("cors");
const httpStatusCodes = require("./utils/httpStatusCodes");

app.disable("e-tag").disable("x-powered-by");
app.disable("etag");
app.use(bodyParser.json({ limit: "5mb" }));
process.stdin.resume();

app.get("/", (req, res) => {
  res.json({ status: "success", userName });
});

const port = process.env.PORT || 8080;
app.set("post", port);
const server = http.createServer(app);

process.on("unhandledRejection", (error) => {
  console.error("Uncaught Error", error);
});

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  switch (error.code) {
    case "EACCES":
      process.exit(1);
    case "EADDRINUSE":
      process.exit(1);
    default:
      throw error;
  }
}

async function startServer() {
  app.use(cors(corsOptions));

  app.use(express.json()); // to parse req.body

  await routeConfig(app);

  await connectToDb().catch((error) =>
    console.error("error while connection is:", error)
  );

  // default route if not matching the route
  app.all("*", (req, res, next) => {
    const err = new Error(`Cannot find ${req.originalUrl} on the server`);
    err.status = "fail";
    err.statusCode = httpStatusCodes.NOT_FOUND;
    next(err);
  });

  app.use((error, req, res, next) => {
    error.statusCode = error.statusCode || httpStatusCodes.BAD_REQUEST;
    error.status = error.status || "error";

    // res.status(error.statusCode).json({
    //   status: error.statusCode,
    //   message: error.message,
    // });

    errorHandler(error, req, res, next);
  });

  server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
  server.on("error", onError);
}

startServer();
