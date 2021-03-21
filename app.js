// @ts-nocheck
require('dotenv').config();
const path = require("path");
const http = require("http");
const bodyParser = require('body-parser');
const express = require("express");
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const socketIO = require('socket.io');
const tmdb = require('./handling/tmdbHandler');
const search = require("./handling/searchHandler");
const logger = require('./logging/logger');

//Her starter vi innsamling av data og setter klar et objekt som holder alt av lettvinn info
tmdb.data.hentTmdbInformasjon();

//Her kobler vi opp databasen
logger.log({level: 'info',message: 'Establishing connection to database'});
mongoose
  .connect(process.env.MONGO_DB_URL || "mongodb://localhost:27017/app", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then((_) => logger.log({level: 'info', message: 'Successfully connected to database!'}))
  .catch((err) => logger.log({level: 'error', message: `Cant connect to database! Error: ${err}`}));

//Setter port
const port = process.env.PORT || 3000;

//Lager default path til public, dette er da på klientsiden
const publicPath = path.join(__dirname, "/public");

//Lager objektet app
const app = express();

//Denne lager serveren, "starter den".
let server = http.createServer(app);

//kobler sammen socketIo og server
let io = socketIO(server);

//Setter express til å bruke pug
app.set("view engine", "pug");

//Forteller express hvordan public path som skal brukes
app.use(express.static(publicPath));

//Fortelle express at pakken session skal brukes
app.use(session({
  secret: process.env.SESSION_SECRET, //her burde det brukes .env
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    touchAfter: 12 * 3600 // time period in seconds
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 //Setter cookies til å slettes etter 1 day
  }
}));

//Denne sier at vi skal bruke bodyParser som gjør om body til json
app.use(bodyParser.json()); 

//Samme som over bare application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

//Bruk routes
app.use(require('./routing'));

//Error handling
app.use((err, req, res, next) => {
    res.send("Something wrong happen! Please try again later");
    logger.log({level: 'error',message: `Express threw an error! Error: ${err}`});
});

//Setter opp socket.io
io.on('connection', async (socket) => {
  //Logger at ny bruker logget på nettsiden
  logger.log({level: 'info',message: `New user just connected`});

  //Metode som kjører dersom bruker logger ut av nettsiden
  socket.on('disconnect', () => {
    logger.log({level: 'info',message: `User disconnected`});
  })

  //Skaffer info fra search baren på index.js
  socket.on("userInputSearch", async (userInputSearch) => {
    if(userInputSearch.length < 2)
        return;
    logger.log({level: 'debug',message: `User searching for movie: ${userInputSearch}`});
    const results = await search(userInputSearch); //henter info
    if(results) {
        logger.log({level: 'debug',message: `Movie respons from API: ${results}`});
        socket.emit('resultatFilm', results); //Sender info til klient
        return;
    }
    logger.log({level: 'warn',message:'No result found'})
  })
});

//"Lytter" serveren
server.listen(port, () => logger.log({level: 'info', message: `Application is now listening on port ${port}`}));