const got = require('got');
const logger = require('../logging/logger');

//Her kan dere legge inn hjelpemetoder dere vil lage
 var methods = {
     //lagFinDato metoden gjør om en dato lettere å lese
     lagFinDato: function(datoInn, stringTilSplitting) {
         try {
            let splitDato = datoInn.split(stringTilSplitting);
            const dato = new Date(splitDato[0], splitDato[1]-1, splitDato[2])
            return dato.toLocaleString('default', { day: 'numeric', month: 'long', year: 'numeric' });
         } catch(err) {
            logger.log({level: 'error', message: `Could not format date from ${datoInn} with string ${stringTilSplitting}! Error: ${err}`}); 
         }
     },
     lagFinDatoFraDB: function(datoInn, stringTilSplitting) {
        try {
           let d = datoInn.toLocaleString('default', { day: 'numeric', month: 'long', year: 'numeric' });
           d = `${d.split(stringTilSplitting)[0]} ${d.split(stringTilSplitting)[1]}`
           return d;
        } catch(err) {
           logger.log({level: 'error', message: `Could not format date from ${datoInn} with string ${stringTilSplitting}! Error: ${err}`}); 
        }
    },

    // lagfinMåned Funksjon for å hente månedsnummer (plassering)
    lagfinMåned: function(datoInn, stringTilSplitting) {
        try {
                let splitDato = datoInn.split(stringTilSplitting);
                const dato = new Date(splitDato[0], splitDato[1]-1, splitDato[2]-1)
                const monthName = dato.getMonth()
              return monthName
            } catch(err) {
                logger.log({level: 'error', message: `Could not format month from ${datoInn} with string ${stringTilSplitting}! Error: ${err}`}); 
            }
        },

    // lagfinDag Funksjon for å hente dagsnummer sin plassering
    lagfinDag: function(datoInn, stringTilSplitting) {
        try {
                let splitDato = datoInn.split(stringTilSplitting);
                const dato = new Date(splitDato[0], splitDato[1]-1, splitDato[2]-1)
                const dagnavn = dato.getDate()
                return dagnavn
            } catch(err) {
                logger.log({level: 'error', message: `Could not format day from ${datoInn} with string ${stringTilSplitting}! Error: ${err}`});
            }
        },
        
    // lagfinÅrstall Funksjon Henter årstall
    lagfinÅrstall: function(datoInn, stringTilSplitting) {
        try {
                let splitDato = datoInn.split(stringTilSplitting);
                const dato = new Date(splitDato[0], splitDato[1]-1, splitDato[2]-1)
                const år = dato.getFullYear()
                return år
            } catch(err) {
                logger.log({level: 'error', message: `Could not format year from ${datoInn} with string ${stringTilSplitting}! Error: ${err}`});
            }
        },
     validateEmail: function(email){
        try{
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }catch(err){
            logger.log({level: 'error', message: `Could not validate email ${email}! Error: ${err}`});
        }
     },
     validatePassword: function(password){
         try{
            const passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
            return passw.test(String(password));
         }catch(err){
            logger.log({level: 'error', message: `Could not validate password! Error: ${err}`});
         }
     },
     sjekkOmBildeLoader: function(url) {
        return got(url, {http2: true}).then(res=>{
            if(res.statusCode == 200) {
                return true;
            } else {
                return false;
            }
        })},
 };
 
 exports.data = methods;