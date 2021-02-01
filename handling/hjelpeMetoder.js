const got = require('got');
const {
    performance,
    PerformanceObserver
  } = require('perf_hooks');

//Her kan dere legge inn hjelpemetoder dere vil lage
 var methods = {
     //lagFinDato metoden gjør om en dato lettere å lese
     lagFinDato: function(datoInn, stringTilSplitting) {
         try {
            let splitDato = datoInn.split(stringTilSplitting);
            const dato = new Date(splitDato[0], splitDato[1]-1, splitDato[2])
            return dato.toLocaleString('default', { day: 'numeric', month: 'long', year: 'numeric' });
         } catch(err) {
             console.log(err);
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
                console.log(err);
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
                console.log(err);
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
                console.log(err);
            }
        },

     validateEmail: function(email){
        try{
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }catch(err){
            console.log(err);
        }
     },
     validatePassword: function(password){
         try{
            const passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
            return passw.test(String(password));
         }catch(err){
             console.log(err);
         }
     },
     sjekkOmBildeLoader: function(url) {
        let per = performance.now()
        // @ts-ignore
        return got(url, {http2: true}).then(res=>{
            if(res.statusCode == 200) {
                console.log(`Getting information - Current time: ${((performance.now() - per) / 1000).toFixed(2)}s`);
                return true;
            } else {
                return false;
            }
        })}
 };
 
 exports.data = methods;