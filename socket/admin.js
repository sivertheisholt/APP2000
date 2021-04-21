const hjelpemetoder = require('../handling/hjelpeMetoder');
const fs = require('fs');
const reviewEditor = require('../review/reviewEditor');
const reviewGetter = require('../review/reviewGetter');
const ticketEditor = require('../ticket/ticketEditor');


/**
 * Leser filen med angitt språkkode og sender den til klienten
 * @param {socket} socket 
 * @param {int} langId 
 */
async function getLanguage(socket, langId){
    let language = await hjelpemetoder.data.lesFil(`./lang/${langId}.json`);
    socket.emit('displayLang', language.information);
}

/**
 * Lagrer endringer til angitt språk
 * @param {socket} socket 
 * @param {int, array} args 
 */
async function saveLanguage(socket, args){
    fs.writeFile(`./lang/${args.langId}.json`, args.langContent,(err) =>{
        if(err){
            console.log(err);
        }
        console.log("file has been saved");
    });
    socket.emit('savedLanguage');
}

/**
 * Tar inn en id og godkjenner anmeldelsen fra brukeren
 * @param {socket} socket 
 * @param {int} reviewId 
 */
async function approveReview(socket, reviewId){
    let result = await reviewEditor.approveReview(reviewId);
    socket.emit('approveReviewResult', result);
}

/**
 * Avslår en anmeldelse
 * @param {Object} socket 
 * @param {Object} review 
 */
async function denyReview(socket, review){
    let result = await reviewEditor.denyReview(review.reviewId, review.reason);
    socket.emit('denyReviewResult', result);
}

/**
 * Henter anmeldelser basert på filmId og type media(film/tv)
 * @param {Object} socket 
 * @param {Object} media 
 */
async function getReviewsFromMedia(socket, media){
    let result = await reviewGetter.getApprovedReviews(media.mediaId, media.type);
    socket.emit('getReviewsFromMediaResult', result);
}

/**
 * Svarer på ticket
 * @param {Object} socket 
 * @param {Object} ticket 
 */
async function respondTicket(socket, ticket){
    let result = await ticketEditor.finishTicket(ticket);
    socket.emit('respondTicketResult', result);
}

/**
 * Redigerer en anmeldelse
 * @param {Object} socket 
 * @param {Object} review 
 */
async function editReview(socket, review){
    let result = await reviewEditor.editReview(review.reviewId, review.newText,review.newRating);
    socket.emit('editReviewResult', result);
}





module.exports = {getLanguage, saveLanguage, approveReview, denyReview, getReviewsFromMedia, respondTicket, editReview}