const got = require('got');
const logger = require('../logging/logger');
const fs = require('fs');
const ValidationHandler = require('./ValidationHandler');


//Her kan dere legge inn hjelpemetoder dere vil lage
 var methods = {
    /**
     * lagFinDato metoden gjør en dato lettere å lese
     * @param {Date} datoInn 
     * @param {String} stringTilSplitting 
     * @returns String
     */
    lagFinDato: function(datoInn, stringTilSplitting) {
        try {
            let splitDato = datoInn.split(stringTilSplitting);
            const dato = new Date(splitDato[0], splitDato[1]-1, splitDato[2])
            return dato.toLocaleString('default', { day: 'numeric', month: 'long', year: 'numeric' });
        } catch(err) {
            logger.log({level: 'error', message: `Could not format date from ${datoInn} with string ${stringTilSplitting}! Error: ${err}`}); 
        }
    },
    /**
     * Formaterer dato fra database fin
     * @param {Date} datoInn 
     * @param {String} stringTilSplitting 
     * @returns String
     */
    lagFinDatoFraDB: function(datoInn, stringTilSplitting) {
        try {
            let d = datoInn.toLocaleString('default', { day: 'numeric', month: 'long', year: 'numeric' });
            d = `${d.split(stringTilSplitting)[0]} ${d.split(stringTilSplitting)[1]}`
            return d;
        } catch(err) {
            logger.log({level: 'error', message: `Could not format date from ${datoInn} with string ${stringTilSplitting}! Error: ${err}`}); 
        }
    },
    /**
     * Henter månedsnummer (plasser) fra dato
     * @param {Date} datoInn 
     * @param {String} stringTilSplitting 
     * @returns Månedsnummer
     */
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
    /**
     * Henter dagsnummer sin plassering fra dato
     * @param {Date} datoInn 
     * @param {String} stringTilSplitting 
     * @returns Dagsnummer
     */
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
    /**
     * Henter årstall fra dato
     * @param {Date} datoInn 
     * @param {String} stringTilSplitting 
     * @returns Årstall
     */
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
    /**
     * Sjekker om email er valid
     * @param {String} email 
     * @returns 
     */
    validateEmail: function(email){
        try{
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }catch(err) {
            logger.log({level: 'error', message: `Could not validate email ${email}! Error: ${err}`});
        }
    },
    /**
     * Sjekker om passord er valid
     * @param {String} password 
     * @returns 
     */
    validatePassword: function(password){
        try{
            const passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
            return passw.test(String(password));
        }catch(err) {
            logger.log({level: 'error', message: `Could not validate password! Error: ${err}`});
        }
    },
    /**
     * Sjekker om bilde url laster inn
     * @param {String} url 
     * @returns boolean
     */
    sjekkOmBildeLoader: function(url) {
        return got(url, {http2: true}).then(res=>{
            if(res.statusCode == 200) {
                return true;
            } else {
                return false;
            }
        })  
    },
    /**
     * Leser fil
     * @param {String} path 
     * @returns String
     */
    lesFil: async function(path){
        return new Promise(function (resolve, reject) {
            fs.readFile(path, 'utf8', function (err, data) {
                if (err)
                    reject(new ValidationHandler(false, "Something went wrong"));
                else
                    resolve(new ValidationHandler(true, data));
            });
        });
    },
    /**
     * Formaterer tall til hele tusen/millioner/milliarder - Gov
     * @param {Number} int 
     * @returns tall i hele tusen/millioner/milliarder
     */
    tallFormatering: function(int) {
        if (int < 999999)
            return `${Math.round(int / 1000)}K`
        if (int < 999999999)
            return `${Math.round(int / 1000000)}M`
        return `${Math.round(int / 1000000000)}B`
    },
 };
 
 exports.data = methods;