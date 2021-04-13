const hjelpemetoder = require('../handling/hjelpeMetoder');
const fs = require('fs');

async function getLanguage(socket, langId) {
    let language = await hjelpemetoder.data.lesFil(`./lang/${langId}.json`);
    socket.emit('displayLang', language.information);
}

async function saveLanguage(socket, args){
    //args.langId = Språkkode
    //args.langContent = Innholdet
    fs.writeFile(`./lang/${args.langId}.json`, args.langContent,(err) =>{
        if(err){
            console.log(err);
        }
        console.log("file has been saved");
    });
    socket.emit('savedLanguage');
}

module.exports = {getLanguage, saveLanguage}