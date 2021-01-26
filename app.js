require('dotenv').config();
const path = require("path");
const http = require("http");
const bodyParser = require('body-parser');
const parse = require('node-html-parser');
const express = require("express");
const session = require('express-session');
const mongoose = require('mongoose');
const socketIO = require('socket.io');
const hjelpeMetoder = require('./handling/hjelpeMetoder');

//Her kobler vi opp databasen
const connection = mongoose
  .connect(process.env.MONGO_DB_URL || "mongodb://localhost:27017/app", { useNewUrlParser: true, useUnifiedTopology: true })
  .then((_) => console.log("Connected to DB"))
  .catch((err) => console.error("error", err));

//Setter port
const port = process.env.PORT || 3000;

//Lager default path til public, dette er da på klientsiden
const publicPath = path.join(__dirname, "/public");

//Implementerer metodene i tmdbHandler.js
const theMovieDatabase = require("./handling/tmdbHandler.js");

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
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 //Setter cookies til å slettes etter 1 day
  }
}));

//Denne sier at vi skal bruke bodyParser som gjør om body til json
app.use(bodyParser.json()); 

//Samme som over bare application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

//Her starter vi innsamling av data og setter klar et objekt som holder alt av lettvinn info
hjelpeMetoder.data.hentTmdbInformasjon();

//Bruk routes
app.use(require('./routing'));

//Setter opp socket.io
io.on('connection', async (socket) => {
  //Logger at ny bruker logget på nettsiden
  console.log("New user just connected");

  //Metode som kjører dersom bruker logger ut av nettsiden
  socket.on('disconnect', () => {
    console.log('User was disconnected')
  })
  
  //Test av The Movie Database API
  const testFilm = await theMovieDatabase.data.getMovieInfo("Spider-Man: Into the Spider-Verse");
  socket.emit('skaffFilm', testFilm);

});

//"Lytter" serveren
server.listen(port, () => console.log("Example app listening on port 3000!"));