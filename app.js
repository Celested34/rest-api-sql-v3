'use strict';

//import dependencies
const express = require('express');
const morgan = require('morgan');
const { sequelize } = require("./models");

// variables
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';


const app = express();

// setup morgan 
app.use(morgan('dev'));

// check the connection 
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
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

// set up port
app.set('port', process.env.PORT || 5000);

//check connection to the database
try {
  sequelize.authenticate();
  console.log("Connection has been established successfuly");
} catch (error) {
  console.error("Unable to connect to the database", error);
}

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
