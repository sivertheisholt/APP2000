const path = require("path");
const http = require("http");
const express = require("express");
const port = 3000;
const app = express();
const publicPath = path.join(__dirname, "/public");

app.set("view engine", "pug");
app.use(express.static(publicPath));

app.get("/", async function (req, res) {
  res.render("index", {
    title: "Hello World",
  });
});

app.listen(port, () => console.log("Example app listening on port 3000!"));
