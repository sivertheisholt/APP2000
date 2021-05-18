const got = require('got');
const logger = require('../logging/logger');
const fs = require('fs');
const ValidationHandler = require('./ValidationHandler');
const { stringify } = require('querystring');


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
     * @returns String
     */
    lagFinDatoFraDB: function(datoInn) {
        try {
            var date = new Date(datoInn);
            return date.toLocaleString('default', { day: 'numeric', month: 'long', year: 'numeric' });
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
     * @returns boolean
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
    /**
     * Henter alle språkkodene tilgjenglig på siden
     * @returns Språkkoder
     */
    getAllLangCodes: async function(){
        let langCodes = [];
        let languageJson = await methods.lesFil("./lang/langList.json");
        for(const language of await JSON.parse(languageJson.information).availableLanguage) {
            langCodes.push(language.id);
        }
        return langCodes;
    },
    /**
     * Validerer innholdet av input om det tilfredstiller kravene
     * @param {Object} input 
     * @returns ValidationHandler
     */
    validateNewLang: function(input){
        const re = /[A-Za-z]/;
        if(input.admindashlangcode.length !== 2){
            return new ValidationHandler(false, 'Has to be 2 characters');
        }
        if(!re.test(input.admindashlangcode)){
            return new ValidationHandler(false, 'Langcode has to be letters');
        }
        if(!re.test(input.admindashlangname)){
            return new ValidationHandler(false, 'Langcode has to be letters');
        }
        var langObj = {
            "name": input.admindashlangname.toLowerCase(),
            "id": input.admindashlangcode.toLowerCase(),
            "originalname": input.admindashlangoriginalname.charAt(0).toUpperCase() + input.admindashlangoriginalname.slice(1)
        }
        return new ValidationHandler(true, langObj);
    },
    expressIgnoreJavascript: function (url) {
        return url.startsWith('/javascript');
    },
    /**
     * Sjekker at språket som administrator prøver å slette er skrevet korrekt og finnes i systemet
     * @param {String} input 
     * @returns ValidationHandler
     */
    validateDeleteLang: async function(input){
        let languageJson = await methods.lesFil("./lang/langList.json");
        let langs = await JSON.parse(languageJson.information);
        let newLangList = [];
        let langToDelete;
        for(let i = 0; i < langs.availableLanguage.length; i++){
            if(langs.availableLanguage[i].name === input){
                langToDelete = langs.availableLanguage[i];
                langs.availableLanguage.splice(i, i);
                newLangList = JSON.stringify(langs);
                fs.writeFile('./lang/langList.json', newLangList, 'utf8', (err) => {
                    if(err){
                        return new ValidationHandler(false, 'Could not delete language');
                    }
                    console.log('overwritten');
                });
                return new ValidationHandler(true, langToDelete);
            }
        }
        return new ValidationHandler(false, 'No matching language found');
    },
    shuffleArray: function(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
 };
 
 exports.data = methods;