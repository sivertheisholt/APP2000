require('dotenv').config();
const path = require("path");
const http = require("http");
const bodyParser = require('body-parser');
const parse = require('node-html-parser');
const express = require("express");
const session = require('express-session');
const mongoose = require('mongoose');
const brukerRoutes = require('./handling/routingAuth');
const socketIO = require('socket.io');
const hjelpeMetoder = require('./handling/hjelpeMetoder');

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
  secret: 'DetteErSecret', //her burde det brukes .env
  resave: true,
  saveUninitialized: true
}));

//Denne sier at vi skal bruke bodyParser som gjør om body til json
app.use(bodyParser.json()); 

//Samme som over bare application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

//Her starter vi innsamling av data og setter klar et objekt som holder alt av lettvinn info
let tmdbInformasjon;
oppdaterTmdbData();

//Bruk routes
app.use("/auth", brukerRoutes);

//Disse 4 håndterer hvilken side du er på, / er da root. Disse skal bli fjerna senere
app.get("/", async (req, res) => {
  let finalListMovies = []; //Lager en tom array
  let finalListTvshows = []; //Lager en tom array

  for(movie of tmdbInformasjon.discoverMovies) { //For loop imellom hver item i discoverMovies
    //Lager et object for hver movie
    let tempObjectMovie = {
      id: movie.id,
      pictureUrl: movie.poster_path,
      title: movie.original_title,
      releaseDate: await hjelpeMetoder.data.lagFinDato(movie.release_date, "-")
    }
    finalListMovies.push(tempObjectMovie);
  }
  for(tvshow of tmdbInformasjon.discoverTvshows) { //For loop imellom hver item i discoverMovies
    //Lager et object for hver movie
    let tempObjectTvshow = {
      id: tvshow.id,
      pictureUrl: tvshow.poster_path,
      title: tvshow.name,
      releaseDate: await hjelpeMetoder.data.lagFinDato(tvshow.first_air_date, "-")
    }
    finalListTvshows.push(tempObjectTvshow);
  }

  //res.set('Content-Type', 'application/javascript');
  res.render("index", {
    discoverMovies: finalListMovies,
    discoverTvshows: finalListTvshows,
  }); //Sender arrayet til pug filen

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

//Denne er for å få tak i all data når nettsiden starter.
async function oppdaterTmdbData() {
  tmdbInformasjon = await hjelpeMetoder.data.hentTmdbInformasjon();
}
