const path = require("path");
const http = require("http");
const express = require("express");
const port = 3000;

//Implementerer socketIo
const socketIO = require('socket.io');

//Lager default path til public, dette er da på klientsiden
const publicPath = path.join(__dirname, "/public");

//Implementerer metodene i tmdbHandler.js
const theMovieDatabase = require("./handling/tmdbHandler.js");

let app = express();

//Denne lager serveren, "starter den".
let server = http.createServer(app);

//kobler sammen socketIo og server
let io = socketIO(server);

//Setter express til å bruke pug
app.set("view engine", "pug");

//Forteller express hva public path er
app.use(express.static(publicPath));

//Disse 3 håndterer hvilken side du er på, / er da root
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

  console.log("New user just connected");

  socket.on('disconnect', () => {
    console.log('User was disconnected')
  })

  const testFilm = await theMovieDatabase.data.getMovieInfo("Spider-Man: Into the Spider-Verse");
  socket.emit('skaffFilm', testFilm);

});

server.listen(port, () => console.log("Example app listening on port 3000!"));
