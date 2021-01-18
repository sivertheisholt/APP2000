const path = require("path");
const http = require("http");
const bodyParser = require('body-parser');
const express = require("express");
const session = require('express-session');
const mongoose = require('mongoose');
const brukerRoutes = require('./handling/routingAuth');
const socketIO = require('socket.io');

//Her kobler vi opp databasen
mongoose
  .connect("mongodb://localhost:27017/app", { useNewUrlParser: true, useUnifiedTopology: true })
  .then((_) => console.log("Connected to DB"))
  .catch((err) => console.error("error", err));

//Setter port
const port = 3000;

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

//Fortelle express at pakken session skal brukes - Session er ikke ferdig enda! Må sette opp cookies
app.use(session({
  secret: 'DetteErSecret',
  resave: true,
  saveUninitialized: true
}));

//Denne sier at vi skal bruke bodyParser som gjør om body til json
app.use(bodyParser.json()); 


//Samme som over bare application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

//Bruk routes
app.use("/auth", brukerRoutes);

//Disse 4 håndterer hvilken side du er på, / er da root. Disse skal bli fjerna senere
app.get("/", (req, res) => {
  res.render("index", {});
});
app.get("/test2", (req, res) => {
  res.render("test2", {});
});
app.get("/test3", (req, res) => {
  res.render("test3", {});
});

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
