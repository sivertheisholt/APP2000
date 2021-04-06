// @ts-nocheck
require('dotenv').config();
const path = require("path");
const http = require("http");
const bodyParser = require('body-parser');
const express = require("express");
let session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const socketIO = require('socket.io');
const tmdb = require('./handling/tmdbHandler');
const logger = require('./logging/logger');
const i18n = require('i18n');
const socketRouter = require('./socket/socketRouter');

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
var sessionExpress = session({
  secret: process.env.SESSION_SECRET, //her burde det brukes .env
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    touchAfter: 12 * 3600 // time period in seconds
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 //Setter cookies til å slettes etter 1 day
  },
});

i18n.configure({
  locales: ['en', 'de', 'no', 'fr', 'ru', 'zh'],
  directory: './lang',
  defaultLocale: 'en'
});

app.use(i18n.init);

var sharedsession = require('express-socket.io-session');

app.use(sessionExpress);

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

io.use(sharedsession(sessionExpress));

//Setter opp socket.io
io.on('connection', async (socket) => {
  //Logger at ny bruker logget på nettsiden
  logger.log({level: 'info',message: `New user just connected`});

  socketRouter(socket);
});
//"Lytter" serveren
server.listen(port, () => logger.log({level: 'info', message: `Application is now listening on port ${port}`}));