const hjelpemetoder = require('../handling/hjelpeMetoder');
const fs = require('fs');
const reviewEditor = require('../review/reviewEditor');

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


async function approveReview(socket, reviewId) {
    let result = await reviewEditor.approveReview(reviewId);
    socket.emit('approveReviewResult', result);
}

async function denyReview(socket, review) {
    let result = await reviewEditor.denyReview(review.reviewId, review.reason);
    console.log(result);
    socket.emit('denyReviewResult', result);
}

module.exports = {getLanguage, saveLanguage,approveReview,denyReview}