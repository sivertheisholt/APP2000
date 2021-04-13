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

async function startServer() {
  const makeInformationResult = await start.makeInformation();
  if(!makeInformationResult.status) {
    //DO SOMETHING
  }
  const connectDatabaseResult = await start.connectToDatabase(mongoose);
  if(!connectDatabaseResult.status) {
    //DO SOMETHING
  }

  //Konfigurer session
  session = await start.configureSession(mongoose, session, MongoStore);

  //Konfigurer app
  const configureAppResult = await start.configureApp(app, session, express);
  if(!configureAppResult.status) {
    //DO SOMETHING
  }
  //Konfigurer socket
  start.configureIo(io, session);

  //Start socket
  start.startRouting(app, io);
  
  //"Lytter" serveren
  server.listen(port, () => logger.log({level: 'info', message: `Application is now listening on port ${port}`}));
}

startServer()