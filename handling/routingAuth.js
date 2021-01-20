const express = require('express');
const Bruker = require('./brukerSchema');
const router = express.Router();
const bcrypt = require("bcrypt");

router.get("/signup", (req, res) => {
    res.render("auth/sucess", {});
});

router.get("/login", (req, res) => {
    res.render("auth/sucess", {});
});

router.get("/sucess", (req, res) => {
    res.render("auth/sucess", {});
});
//Først kan vi sette opp signup
router.post("/signup", async (req, res) => { //Grunnen til at vi bruker async er fordi det å hashe tar tid, vi vil ikke at koden bare skal fortsette
    const pugBody = req.body; //Skaffer body fra form
    console.log(pugBody);

    //Vi gjør en sjekk at alle feltene er fylt inn
    if(!(pugBody.email && pugBody.password && pugBody.passwordRepeat)) {
        return res.status(400).send({error: "Data is not properly formatted"}); //Vi returnerer res (result) og sier at dataen ikke er riktig
    }
    //Vi gjør en sjekk at passord 1 er lik passord 2 (Repeat password)
    if(!(pugBody.password == pugBody.passwordRepeat)) {
        return res.status(400).send({error: "Passwords do not match"}); //Denne må endres, viser bare en error melding dersom de ikke matcher for nå
    }

    //Nå må vi lage et nytt bruker objekt
    
    const bruker = new Bruker(pugBody);
    
    //Nå må vi lage ny salt for å hashe passord
    const salt = await bcrypt.genSalt(10); //Her kommer await (Se async) inn (Nå venter vi til bcrypt er ferdig)

    //Nå setter vi passord til det hasha passordet
    bruker.password = await bcrypt.hash(bruker.password, salt);
    bruker.save().then((dokument) => {
        res.status(201).send(dokument);
        //res.redirect(301, '../');
    })  //Redirecter tilbake til root
});

//Her tar vi oss av login
router.post("/login", async (req, res) => { //Grunnen til at vi bruker async er fordi det å hashe tar tid, vi vil ikke at koden bare skal fortsette
    const pugBody = req.body; //Skaffer body fra form
    console.log(pugBody.email);
    const bruker = await Bruker.findOne({email: pugBody.email}); //Finner brukeren fra databasen
    

    //Nå skal vi sjekke om passordet stemmer
    if(bruker) {
        const sjekkPassword = await bcrypt.compare(pugBody.password, bruker.password); //Bruker bcrypt for å sammenligne, true/false return
    
        if (sjekkPassword) {
            res.status(200).json({ message: "Valid password" }); //Returnerer 200 dersom passordet var riktig
            //res.redirect(301, 'sucess');
          } else {
            res.status(400).json({ error: "Invalid Password" }); //Returnerer 400 dersom passordet var feil
          }
    } else {
        res.status(401).json({ error: "User does not exist" }); //Returnerer 401 dersom brukeren ikke eksisterer
    }
});

module.exports = router;