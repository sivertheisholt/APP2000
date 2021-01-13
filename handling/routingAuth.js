const express = require('express');
const Bruker = require('./brukerSchema');
const router = express.Router();
const bcrypt = require("bcrypt");

router.get("/signup", (req, res) => {
    res.render("auth/signup", {});
});
router.get("/login", (req, res) => {
    res.render("auth/login", {});
});

//Først kan vi sette opp signup
router.post("/signup", async (req, res) => { //Grunnen til at vi bruker async er fordi det å hashe tar tid, vi vil ikke at koden bare skal fortsette
    const pugBody = req.body; //Skaffer body fra form

    //Vi gjør en sjekk at alle feltene er fylt inn
    if(!(pugBody.username && pugBody.password)) {
        return res.status(400).send({error: "Data is not properly formatted"}); //Vi returnerer res (result) og sier at dataen ikke er riktig
    }

    //Nå må vi lage et nytt bruker objekt
    const bruker = new Bruker(pugBody);
    
    //Nå må vi lage ny salt for å hashe passord
    const salt = await bcrypt.genSalt(10); //Her kommer await (Se async) inn (Nå venter vi til bcrypt er ferdig)

    //Nå setter vi passord til det hasha passordet
    bruker.password = await bcrypt.hash(bruker.password, salt);
    bruker.save().then((dokument) => {
        res.status(201).send(dokument);
        res.redirect(301, '../');
    })  //Redirecter tilbake til root
});

//Her tar vi oss av login
router.post("/login", async (req, res) => { //Grunnen til at vi bruker async er fordi det å hashe tar tid, vi vil ikke at koden bare skal fortsette
    const pugBody = req.body; //Skaffer body fra form
    const bruker = await Bruker.findOne({username: pugBody.username}); //Finner brukeren fra databasen

    //Nå skal vi sjekke om passordet stemmer
    if(bruker) {
        const sjekkPassword = await bcrypt.compare(pugBody.password, bruker.password); //Bruker bcrypt for å sammenligne, true/false return
    
        if (sjekkPassword) {
            res.status(200).json({ message: "Valid password" }); //Returnerer 200 dersom passordet var riktig
            res.redirect(301, '../');
          } else {
            res.status(400).json({ error: "Invalid Password" }); //Returnerer 400 dersom passordet var feil
          }
    } else {
        res.status(401).json({ error: "User does not exist" }); //Returnerer 401 dersom brukeren ikke eksisterer
    }
});

module.exports = router;