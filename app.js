require('dotenv').config();
const http = require("http");
const express = require("express");
let session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const socketIO = require('socket.io');
const logger = require('./logging/logger');
const start = require('./misc/initializer/startup');

//Lager objektet app
const app = express();
//Setter port
const port = process.env.PORT || 3000;
//Denne lager serveren, "starter den".
let server = http.createServer(app);
//kobler sammen socketIo og server
let io = socketIO(server);

async function startSystems() {

  //Skaff start informasjon fra tmdb
  const makeInformationResult = await start.makeInformation();
  if(!makeInformationResult.status) {
    throw new Error(makeInformationResult.information);
  }

  //Koble til database
  const connectDatabaseResult = await start.connectToDatabase(mongoose);
  if(!connectDatabaseResult.status) {
    throw new Error(connectDatabaseResult.information);
  }

  //Konfigurer session
  session = await start.configureSession(mongoose, session, MongoStore);

  //Konfigurer app
  const configureAppResult = await start.configureApp(app, session, express);
  if(!configureAppResult.status) {
    throw new Error(configureAppResult.information);
  }

  //Konfigurer socket
  start.configureIo(io, session);

  //Start socket
  start.startRouting(app, io);
  
  //"Lytter" serveren
  server.listen(port, () => logger.log({level: 'info', message: `Application is now listening on port ${port}`}));

  //Skaffer ny start info fra tmdb hver 24 time
  setInterval(async function() {
    const makeInformationResult = await start.makeInformation();
    if(!makeInformationResult.status) {
      throw new Error(makeInformationResult.information);
    }
  }, 1000 * 60 * 60 * 24)
}

startServer()

//Starter serveren
function startServer() {
  try {
    startSystems();
  } catch(err) {
    logger.log({level: 'error', message: `Something unexpected happen when trying to start/running the server! ${err}`});
    serverFailure();
  }
}

//Setter en timeout på 5 minutter og prøver å restarte
async function serverFailure() {
  logger.log({level: 'info', message: `Trying to restart server in 5 minutes!`});
  await new Promise(r => setTimeout(r, 1000 * 60 * 5));
  logger.log({level: 'info', message: `Restarting systems now!`});
  startServer();
}