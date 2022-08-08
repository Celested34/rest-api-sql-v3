"use strict";

const express = require("express");

const { sequelize } = require("./models");
const morgan = require("morgan");

//from routes folder
const userRoutes = require("./routes/userRo");
const courseRoutes = require("./routes/courseRo");


// global error logging
const enableGlobalErrorLogging =
  process.env.ENABLE_GLOBAL_ERROR_LOGGING === "true";

// create the Express app
const app = express();
app.use(express.json());

// setup morgan 
app.use(morgan("dev"));

//set up routes
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);

// setup a greeting for the root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the REST API project!",
  });
});

//test connection to database
try {
  sequelize.authenticate();
  console.log("Connection has been established");
} catch (error) {
  console.error("Unable to connect to the database", error);
}

// send 404 
app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found",
  });
});

// global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set("port", process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get("port"), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});