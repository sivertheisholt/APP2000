const hjelpemetoder = require('../handling/hjelpeMetoder');
const fs = require('fs');
const reviewEditor = require('../review/reviewEditor');
const reviewGetter = require('../review/reviewGetter');
const ticketEditor = require('../ticket/ticketEditor');

async function getLanguage(socket, langId){
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

async function approveReview(socket, reviewId){
    let result = await reviewEditor.approveReview(reviewId);
    socket.emit('approveReviewResult', result);
}

async function denyReview(socket, review){
    let result = await reviewEditor.denyReview(review.reviewId, review.reason);
    socket.emit('denyReviewResult', result);
}

async function getReviewsFromMedia(socket, media){
    let result = await reviewGetter.getApprovedReviews(media.mediaId, media.type);
    socket.emit('getReviewsFromMediaResult', result);
}

async function respondTicket(socket, ticket){
    let result = await ticketEditor.finishTicket(ticket);
    socket.emit('respondTicketResult', result);
}

async function editReview(socket, review){
    console.log(review);
    let result = await reviewEditor.editReview(review.reviewId, review.newText,review.newRating);
    socket.emit('editReviewResult', result);
}





module.exports = {getLanguage, saveLanguage, approveReview, denyReview, getReviewsFromMedia, respondTicket, editReview}